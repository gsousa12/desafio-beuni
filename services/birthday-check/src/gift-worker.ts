import { Job } from "bullmq";
import logger from "./logger";
import { BirthdayJobData } from "packages/types/dist";
import { createBirthdayWorker } from "./queue";

const processGiftJob = async (job: Job<BirthdayJobData>): Promise<any> => {
  const { employee, scheduledAt } = job.data;
  const employeeInfo = employee.employee;

  logger.info("[gift-worker] processing birthday gift", {
    jobId: job.id,
    employeeId: employeeInfo.id,
    employeeName: employeeInfo.name,
    birthDate: `${employeeInfo.birth_date_day}/${employeeInfo.birth_date_month}`,
    organization: employee.organization.name,
  });

  try {
    // Simular processamento do brinde
    // Aqui seria integração com sistema de brindes/API externa
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Log do resultado final - ESTE É O DADO QUE A API VAI CONSUMIR
    const giftData = {
      employeeId: employeeInfo.id,
      employeeName: employeeInfo.name,
      employeeEmail: employeeInfo.email,
      position: employeeInfo.position,
      birthDate: {
        day: employeeInfo.birth_date_day,
        month: employeeInfo.birth_date_month,
        year: employeeInfo.birth_date_year,
      },
      organization: {
        id: employee.organization.id,
        name: employee.organization.name,
        address: employee.organization.address,
      },
      processedAt: new Date().toISOString(),
      scheduledAt,
    };

    // TODO: Aqui poderia enviar para outra fila que a API consome
    // await sendToApiQueue(giftData);

    logger.info("[gift-worker] birthday gift processed successfully", {
      employeeId: employeeInfo.id,
      employeeName: employeeInfo.name,
    });

    return {
      success: true,
      ...giftData,
    };
  } catch (error) {
    logger.error("[gift-worker] failed to process birthday gift", {
      jobId: job.id,
      employeeId: employeeInfo.id,
      error,
    });
    throw error;
  }
};

export class GiftWorker {
  private static worker: any;

  static start(concurrency = 5): any {
    logger.info("[gift-worker] starting birthday gift worker", { concurrency });

    this.worker = createBirthdayWorker(processGiftJob, concurrency);

    this.worker.on("ready", () => {
      logger.info("[gift-worker] worker ready and waiting for jobs");
    });

    this.worker.on("error", (error: Error) => {
      logger.error("[gift-worker] worker error", { error });
    });

    this.worker.on("stalled", (jobId: string) => {
      logger.warn("[gift-worker] job stalled", { jobId });
    });

    return this.worker;
  }

  static async shutdown(): Promise<void> {
    if (this.worker) {
      logger.info("[gift-worker] shutting down worker");
      await this.worker.close();
      logger.info("[gift-worker] worker shutdown complete");
    }
  }
}
