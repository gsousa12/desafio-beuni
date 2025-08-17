import { Queue, Worker, Job } from "bullmq";
import { BirthdayJobData } from "../types";
import { giftDeliveryService } from "../service/gift-delivery";

const QUEUE_NAME = "birthday-gifts";
const REDIS_URL = process.env.REDIS_URL ?? "redis://localhost:6379";

let worker: Worker<BirthdayJobData> | null = null;
let queue: Queue<BirthdayJobData> | null = null;
let isShuttingDown = false;

const processJob = async (job: Job<BirthdayJobData>): Promise<void> => {
  const employeeId = job.data.data.employee.id;

  const result = await giftDeliveryService.processGiftDelivery(job.data);

  if (result.success) {
    console.log("[gift-worker] Gift entregue/registrado com sucesso", {
      jobId: job.id,
      employeeId,
      shippingId: result.shippingId,
    });
    return;
  }

  const err = new Error(result.error || "Falha ao processar gift");
  (err as any).__shouldRetry = result.shouldRetry !== false;
  throw err;
};

const setupEventHandlers = (): void => {
  if (!worker) return;

  worker.on("ready", () => {
    console.log("[gift-worker] Worker pronto (background) — consumindo com baixa concorrência.");
  });

  worker.on("failed", async (job, error) => {
    const shouldRetry = (error as any)?.__shouldRetry !== false;
    const employeeId =
      (job?.data as any)?.data?.employee?.id ||
      (job?.data as any)?.employee?.employee?.id ||
      "unknown";

    console.error("[gift-worker] Job falhou", {
      jobId: job?.id,
      employeeId,
      error: error?.message,
      attemptsMade: job?.attemptsMade,
    });

    if (!shouldRetry || !queue) {
      console.warn(
        "[gift-worker] Não será reprocessado (erro não retentável ou queue indisponível)."
      );
      try {
        await job?.remove();
        console.log("[gift-worker] Job falho removido (não retentável)", { jobId: job?.id });
      } catch (removeErr: any) {
        console.warn("[gift-worker] Falha ao remover job falho (não retentável)", {
          jobId: job?.id,
          error: removeErr?.message,
        });
      }
      return;
    }

    try {
      const uniqueIdSuffix = `${Date.now()}`;
      await queue.add("birthday-gift", job!.data, {
        jobId: `${job!.id}:retry:${uniqueIdSuffix}`,
        delay: 30_000,
        removeOnComplete: true,
        removeOnFail: true,
      });
      console.log("[gift-worker] Job re-enfileirado no fim da fila para reprocessamento.");

      try {
        await job?.remove();
        console.log("[gift-worker] Job falho removido após reenfileirar", { jobId: job?.id });
      } catch (removeErr: any) {
        console.warn("[gift-worker] Falha ao remover job falho após reenfileirar", {
          jobId: job?.id,
          error: removeErr?.message,
        });
      }
    } catch (reAddErr) {
      console.error("[gift-worker] Falha ao reenfileirar job:", reAddErr);
    }
  });

  worker.on("completed", async (job) => {
    console.log("[gift-worker] Job completo", { jobId: job.id });
    try {
      await job.remove();
      console.log("[gift-worker] Job removido da fila após sucesso", { jobId: job.id });
    } catch (err: any) {
      console.warn("[gift-worker] Não foi possível remover o job (pode já ter sido removido)", {
        jobId: job.id,
        error: err?.message,
      });
    }
  });

  worker.on("stalled", (jobId) => {
    console.warn("[gift-worker] Job travou", { jobId });
  });

  worker.on("error", (err) => {
    console.error("[gift-worker] Erro no worker", { error: err.message });
  });
};

export const startGiftProcessor = async (concurrency = 1): Promise<void> => {
  if (worker) return;

  queue = new Queue<BirthdayJobData>(QUEUE_NAME, { connection: { url: REDIS_URL } });

  worker = new Worker<BirthdayJobData>(QUEUE_NAME, async (job) => processJob(job), {
    connection: { url: REDIS_URL },
    concurrency,
  });

  setupEventHandlers();
};

export const shutdownGiftProcessor = async (): Promise<void> => {
  if (isShuttingDown) return;
  isShuttingDown = true;

  try {
    await worker?.close();
    await queue?.close();
    console.log("[gift-processor] Encerrado com sucesso.");
  } finally {
    isShuttingDown = false;
  }
};
