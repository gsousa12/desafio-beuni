import { Queue, Worker, QueueEvents, JobsOptions, Processor } from "bullmq";
import IORedis from "ioredis";
import { BirthdayCheckJobData, BirthdayProcessJobData } from "packages/types/dist";

// Union type para todos os tipos de jobs
export type BirthdayJobData = BirthdayCheckJobData | BirthdayProcessJobData;

const connection = new IORedis(process.env.REDIS_URL ?? "redis://localhost:6379", {
  maxRetriesPerRequest: null,
});

const queueName = process.env.BIRTHDAY_QUEUE_NAME ?? "birthday-queue";

// Fila principal para birthday jobs
export const birthdayQueue = new Queue<BirthdayJobData>(queueName, { connection });
export const birthdayQueueEvents = new QueueEvents(queueName, { connection });

// Criador de worker tipado
export const createWorker = (
  processor: Processor<BirthdayJobData, unknown, string>,
  concurrency = Number(process.env.BIRTHDAY_CHECK_CONCURRENCY ?? 5)
) => {
  const worker = new Worker<BirthdayJobData>(queueName, processor, {
    connection,
    concurrency,
  });

  worker.on("completed", (job) => {
    console.log(`[worker] job ${job.id} completed successfully`);
  });

  worker.on("failed", (job, err) => {
    console.error(`[worker] job ${job?.id} failed:`, err);
  });

  worker.on("active", (job) => {
    console.log(`[worker] processing job ${job.id} of type ${job.data.type}`);
  });

  return worker;
};

// Helper para enqueue jobs
export const enqueueBirthdayCheck = async (options?: JobsOptions) => {
  const payload: BirthdayCheckJobData = {
    type: "birthday-check",
    scheduledAt: new Date().toISOString(),
  };

  return await birthdayQueue.add("birthday-check", payload, {
    removeOnComplete: 100,
    removeOnFail: 50,
    ...options,
  });
};

export const enqueueBirthdayProcess = async (
  employee: BirthdayProcessJobData["employee"],
  options?: JobsOptions
) => {
  const payload: BirthdayProcessJobData = {
    type: "birthday-process",
    employee,
  };

  return await birthdayQueue.add("birthday-process", payload, {
    removeOnComplete: 100,
    removeOnFail: 50,
    ...options,
  });
};

export type EnqueueOptions = JobsOptions;
