import { Queue, Worker, QueueEvents, JobsOptions, Processor } from "bullmq";
import IORedis from "ioredis";

export type BirthdayJobData = {
  now: string;
};

const connection = new IORedis(process.env.REDIS_URL ?? "redis://localhost:6379", {
  maxRetriesPerRequest: null,
});

const queueName = process.env.BIRTHDAY_QUEUE_NAME ?? "birthday-queue";

// Tipamos a fila e eventos com o tipo de payload
export const birthdayQueue = new Queue<BirthdayJobData>(queueName, { connection });
export const birthdayQueueEvents = new QueueEvents(queueName, { connection });

// O processor é do tipo Processor<DataType, ResultType, NameType>
export function createWorker(
  processor: Processor<BirthdayJobData, unknown, string>,
  concurrency = Number(process.env.BIRTHDAY_CHECK_CONCURRENCY ?? 5)
) {
  const worker = new Worker<BirthdayJobData>(queueName, processor, {
    connection,
    concurrency,
  });

  worker.on("completed", (job) => {
    console.log(`[worker] job ${job.id} completed`);
  });

  worker.on("failed", (job, err) => {
    console.error(`[worker] job ${job?.id} failed`, err);
  });

  return worker;
}

export type EnqueueOptions = JobsOptions;
