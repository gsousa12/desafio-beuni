import { Job } from "bullmq";
import { createWorker, BirthdayJobData } from "./queue";
import { BirthdayCheckJobData, BirthdayProcessJobData } from "packages/types/dist";

// Processor principal que roteará os diferentes tipos de jobs
const processBirthdayJob = async (job: Job<BirthdayJobData>) => {
  const { data } = job;

  console.log(`[worker] processing job ${job.id} of type: ${data.type}`);

  switch (data.type) {
    case "birthday-check":
      return await processBirthdayCheckJob(job as Job<BirthdayCheckJobData>);

    case "birthday-process":
      return await processBirthdayProcessJob(job as Job<BirthdayProcessJobData>);

    default:
      throw new Error(`[worker] unknown job type: ${(data as any).type}`);
  }
};

// Processa job de verificação geral de aniversários (futuramente pode ser usado para outros triggers)
const processBirthdayCheckJob = async (job: Job<BirthdayCheckJobData>) => {
  const { scheduledAt } = job.data;

  console.log(`[worker] processing birthday check job scheduled at: ${scheduledAt}`);

  // Por enquanto, este job type não faz nada específico
  // Pode ser usado no futuro para validações ou logs centralizados
  return {
    processed: true,
    scheduledAt,
    processedAt: new Date().toISOString(),
  };
};

// Processa job individual de employee
const processBirthdayProcessJob = async (job: Job<BirthdayProcessJobData>) => {
  const { employee } = job.data;

  console.log(
    `[worker] processing birthday for employee: ${employee.employee.name} (${employee.employee.id})`
  );

  try {
    // Aqui seria o lugar onde você enviaria o JSON para outra fila
    // que será consumida pela API para envio dos brindes

    // Por exemplo:
    // await sendToGiftQueue(employee);

    // Por enquanto, apenas logamos o JSON completo
    console.log(`[worker] employee birthday data:`, JSON.stringify(employee, null, 2));

    // Simular algum processamento
    await new Promise((resolve) => setTimeout(resolve, 100));

    console.log(`[worker] successfully processed birthday for: ${employee.employee.name}`);

    return {
      processed: true,
      employeeId: employee.employee.id,
      employeeName: employee.employee.name,
      processedAt: new Date().toISOString(),
      birthDate: employee.employee.birth_date,
      organization: employee.organization.name,
    };
  } catch (error) {
    console.error(
      `[worker] failed to process birthday for employee ${employee.employee.id}:`,
      error
    );
    throw error; // Re-throw para que o BullMQ marque como failed
  }
};

// Factory function para criar e iniciar o worker
const startWorker = (concurrency?: number) => {
  console.log(`[worker] starting birthday worker with concurrency: ${concurrency ?? 5}`);

  const worker = createWorker(processBirthdayJob, concurrency);

  // Event listeners específicos para este worker
  worker.on("ready", () => {
    console.log(`[worker] birthday worker is ready and waiting for jobs`);
  });

  worker.on("error", (err) => {
    console.error(`[worker] birthday worker error:`, err);
  });

  worker.on("stalled", (jobId) => {
    console.warn(`[worker] job ${jobId} stalled`);
  });

  return worker;
};

// Graceful shutdown
const shutdownWorker = async (worker: any) => {
  console.log(`[worker] shutting down birthday worker...`);
  await worker.close();
  console.log(`[worker] birthday worker stopped`);
};

export const BirthdayWorker = {
  start: startWorker,
  shutdown: shutdownWorker,
};
