import { Worker, QueueEvents, Processor } from "bullmq";
import IORedis from "ioredis";
import type { BirthdayJobData } from "./types";
import { simulationClient } from "../clients/simulation/client";

export function startBirthdayWorker() {
  const connection = new IORedis(process.env.REDIS_URL ?? "redis://localhost:6379", {
    maxRetriesPerRequest: null,
  });

  const queueName = process.env.BIRTHDAY_QUEUE_NAME ?? "birthday-queue";

  const processor: Processor<BirthdayJobData, unknown, string> = async (job) => {
    job.log(`Processing job ${job.name}:${job.id}`);
    console.log("[api-core worker] received job:", job.name, job.id, job.data);
    const shipRes = await simulationClient.ship({
      orderId: `TEST-${job.id}`,
      recipientName: "Destinatário Demo",
      address: "Rua Exemplo, 123",
      postalCode: "01000-000",
      city: "São Paulo",
      state: "SP",
      country: "BR",
    });

    console.log("[api-core worker] /ship response:", shipRes);
  };

  const worker = new Worker<BirthdayJobData>(queueName, processor, {
    connection,
    concurrency: 5,
  });

  const events = new QueueEvents(queueName, { connection });

  worker.on("completed", (job) => {
    console.log(`[api-core worker] job ${job.id} completed`);
  });

  worker.on("failed", (job, err) => {
    console.error(`[api-core worker] job ${job?.id} failed`, err);
  });

  events.on("waiting", ({ jobId }) => {
    console.log(`[api-core worker] job waiting: ${jobId}`);
  });

  events.on("stalled", ({ jobId }) => {
    console.warn(`[api-core worker] job stalled: ${jobId}`);
  });

  return { worker, events, connection };
}
