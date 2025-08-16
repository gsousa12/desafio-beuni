import { Queue, Worker, Job } from "bullmq";
import { BirthdayJobData } from "../types";
import { giftDeliveryService } from "../service/gift-delivery.service";

const QUEUE_NAME = "birthday-gifts";
const REDIS_URL = process.env.REDIS_URL ?? "redis://localhost:6379";

export class GiftProcessor {
  private static worker: Worker<BirthdayJobData> | null = null;
  private static queue: Queue<BirthdayJobData> | null = null;
  private static isShuttingDown = false;

  static async start(concurrency = 1): Promise<void> {
    if (this.worker) return;

    this.queue = new Queue<BirthdayJobData>(QUEUE_NAME, { connection: { url: REDIS_URL } });

    this.worker = new Worker<BirthdayJobData>(QUEUE_NAME, async (job) => this.processJob(job), {
      connection: { url: REDIS_URL },
      concurrency,
    });

    this.setupEventHandlers();
  }

  private static async processJob(job: Job<BirthdayJobData>): Promise<void> {
    const employeeId =
      (job.data as any)?.data?.employee?.id ||
      (job.data as any)?.employee?.employee?.id ||
      (job.data as any)?.employee?.id ||
      "unknown";

    const result = await giftDeliveryService.processGiftDelivery(job.data);

    if (result.success) {
      console.log("[gift-processor] Gift entregue/registrado com sucesso", {
        jobId: job.id,
        employeeId,
        shippingId: result.shippingId,
      });
      return;
    }

    const err = new Error(result.error || "Falha ao processar gift");
    (err as any).__shouldRetry = result.shouldRetry !== false;
    throw err;
  }

  private static setupEventHandlers(): void {
    if (!this.worker) return;

    this.worker.on("ready", () => {
      console.log(
        "[gift-processor] Worker pronto (background) — consumindo com baixa concorrência."
      );
    });

    this.worker.on("failed", async (job, error) => {
      const shouldRetry = (error as any)?.__shouldRetry !== false;
      const employeeId =
        (job?.data as any)?.data?.employee?.id ||
        (job?.data as any)?.employee?.employee?.id ||
        "unknown";

      console.error("[gift-processor] Job falhou", {
        jobId: job?.id,
        employeeId,
        error: error?.message,
        attemptsMade: job?.attemptsMade,
      });

      if (!shouldRetry || !this.queue) {
        console.warn(
          "[gift-processor] Não será reprocessado (erro não retentável ou queue indisponível)."
        );
        try {
          await job?.remove();
          console.log("[gift-processor] Job falho removido (não retentável)", { jobId: job?.id });
        } catch (removeErr: any) {
          console.warn("[gift-processor] Falha ao remover job falho (não retentável)", {
            jobId: job?.id,
            error: removeErr?.message,
          });
        }
        return;
      }

      try {
        const uniqueIdSuffix = `${Date.now()}`;
        await this.queue.add("birthday-gift", job!.data, {
          jobId: `${job!.id}:retry:${uniqueIdSuffix}`,
          delay: 30_000,
          removeOnComplete: true,
          removeOnFail: true,
        });
        console.log("[gift-processor] Job re-enfileirado no fim da fila para reprocessamento.");

        try {
          await job?.remove();
          console.log("[gift-processor] Job falho removido após reenfileirar", { jobId: job?.id });
        } catch (removeErr: any) {
          console.warn("[gift-processor] Falha ao remover job falho após reenfileirar", {
            jobId: job?.id,
            error: removeErr?.message,
          });
        }
      } catch (reAddErr) {
        console.error("[gift-processor] Falha ao reenfileirar job:", reAddErr);
      }
    });

    this.worker.on("completed", async (job) => {
      console.log("[gift-processor] Job completo", { jobId: job.id });
      try {
        await job.remove();
        console.log("[gift-processor] Job removido da fila após sucesso", { jobId: job.id });
      } catch (err: any) {
        console.warn(
          "[gift-processor] Não foi possível remover o job (pode já ter sido removido)",
          {
            jobId: job.id,
            error: err?.message,
          }
        );
      }
    });

    this.worker.on("stalled", (jobId) => {
      console.warn("[gift-processor] Job travou", { jobId });
    });

    this.worker.on("error", (err) => {
      console.error("[gift-processor] Erro no worker", { error: err.message });
    });
  }

  static async shutdown(): Promise<void> {
    if (this.isShuttingDown) return;
    this.isShuttingDown = true;

    try {
      await this.worker?.close();
      await this.queue?.close();
      console.log("[gift-processor] Encerrado com sucesso.");
    } finally {
      this.isShuttingDown = false;
    }
  }
}
