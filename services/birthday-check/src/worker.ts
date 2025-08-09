import { createWorker, BirthdayJobData } from "./queue";

export function startWorker() {
  createWorker(async (job) => {
    // job aqui é tipado como Job<BirthdayJobData, unknown, string>
    console.log("[worker] processing job:", job.name, job.id, job.data);
  });
}
