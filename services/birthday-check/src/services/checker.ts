import { DatabaseService } from "../database/database";
import { enqueueEmployeeBirthdayGift, checkForExistingGiftJobs } from "../queues/birthday";
import logger from "./logger";
import { BirthdayJobData } from "packages/types/dist";

const BATCH_SIZE = Number(process.env.BIRTHDAY_BATCH_SIZE ?? 10);
const BATCH_DELAY_MS = Number(process.env.BIRTHDAY_BATCH_DELAY_MS ?? 2000);

export const executeBirthdayCheck = async (): Promise<void> => {
  const startTime = Date.now();
  logger.info("[birthday-check] starting birthday verification process");

  try {
    const totalEmployees = await DatabaseService.countUpcomingBirthdays();

    if (totalEmployees === 0) {
      logger.info("[birthday-check] no upcoming birthdays found");
      return;
    }

    logger.info(`[birthday-check] found ${totalEmployees} employees with upcoming birthdays`);

    const totalBatches = Math.ceil(totalEmployees / BATCH_SIZE);
    let enqueuedCount = 0;
    let skippedCount = 0;

    for (let batch = 0; batch < totalBatches; batch++) {
      logger.info(`[birthday-check] processing batch ${batch + 1}/${totalBatches}`);

      const employees = await DatabaseService.getUpcomingBirthdays(batch, BATCH_SIZE);

      const processingPromises = employees.map(async (employee, index) => {
        const employeeId = employee.employee.id;
        const employeeName = employee.employee.name;

        try {
          // Verificar se já existe job pendente
          const alreadyQueued = await checkForExistingGiftJobs(employeeId);

          if (alreadyQueued) {
            logger.info(`[birthday-check] gift already queued for employee`, {
              employeeId,
              employeeName,
            });
            skippedCount++;
            return;
          }

          // Criar job para envio de brinde
          const jobData: BirthdayJobData = {
            type: "birthday-gift",
            employee,
            scheduledAt: new Date().toISOString(),
          };

          await enqueueEmployeeBirthdayGift(jobData, {
            delay: index * 200, // Escalonar jobs para evitar picos
          });

          logger.info(`[birthday-check] gift job created for employee`, {
            employeeId,
            employeeName,
            birthMonth: employee.employee.birth_date_month,
            birthDay: employee.employee.birth_date_day,
          });

          enqueuedCount++;
        } catch (error) {
          logger.error(`[birthday-check] failed to process employee`, {
            employeeId,
            employeeName,
            error,
          });
        }
      });

      await Promise.allSettled(processingPromises);

      // Pausa entre batches
      if (batch < totalBatches - 1) {
        await new Promise((resolve) => setTimeout(resolve, BATCH_DELAY_MS));
      }
    }

    const duration = Date.now() - startTime;
    logger.info(`[birthday-check] birthday verification completed`, {
      duration: `${duration}ms`,
      totalEmployees,
      enqueuedJobs: enqueuedCount,
      skippedJobs: skippedCount,
    });
  } catch (error) {
    logger.error("[birthday-check] birthday verification failed", { error });
    throw error;
  }
};

export const BirthdayCheckService = {
  executeBirthdayCheck,
};
