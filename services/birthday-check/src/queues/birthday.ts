import { Queue, Worker, Job } from "bullmq";
import logger from "../services/logger";
import { BirthdayJobData } from "packages/types/dist";
import { redisConfig } from "../database/redis";

const QUEUE_NAME = "birthday-gifts";

let queueInstance: Queue<BirthdayJobData> | null = null;

export const getBirthdayQueue = (): Queue<BirthdayJobData> => {
  if (!queueInstance) {
    queueInstance = new Queue<BirthdayJobData>(QUEUE_NAME, redisConfig);
    logger.info("[queue] birthday gift queue initialized");
  }
  return queueInstance;
};

export const enqueueEmployeeBirthdayGift = async (
  jobData: BirthdayJobData,
  options?: { delay?: number }
) => {
  const queue = getBirthdayQueue();
  const jobId = `birthday-gift-${jobData.employee.employee.id}`;

  const job = await queue.add("birthday-gift", jobData, {
    jobId,
    delay: options?.delay,
    removeOnComplete: 50,
    removeOnFail: 100,
  });

  logger.info(`[queue] enqueued gift job for ${jobData.employee.employee.name}`, {
    jobId: job.id,
    employeeId: jobData.employee.employee.id,
  });

  return job;
};

export const createBirthdayWorker = (
  processor: (job: Job<BirthdayJobData>) => Promise<any>,
  concurrency = 5
) => {
  const worker = new Worker<BirthdayJobData>(QUEUE_NAME, processor, {
    ...redisConfig,
    concurrency,
  });

  worker.on("completed", (job) => {
    logger.info(`[queue] gift job completed successfully`, { jobId: job.id });
  });

  worker.on("failed", (job, err) => {
    logger.error(`[queue] gift job failed`, { jobId: job?.id, error: err.message });
  });

  return worker;
};

export const checkForExistingGiftJobs = async (employeeId: string): Promise<boolean> => {
  try {
    const queue = getBirthdayQueue();
    const [waiting, active, delayed] = await Promise.all([
      queue.getWaiting(),
      queue.getActive(),
      queue.getDelayed(),
    ]);

    const allJobs = [...waiting, ...active, ...delayed];
    const existingJob = allJobs.find((job) => job.data?.employee?.employee?.id === employeeId);

    return !!existingJob;
  } catch (error) {
    logger.error("[queue] error checking existing jobs", { employeeId, error });
    return false;
  }
};
