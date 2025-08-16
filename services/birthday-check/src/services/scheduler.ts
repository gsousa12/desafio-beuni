import * as cron from "node-cron";
import logger from "./logger";
import { BirthdayCheckService } from "./checker";

export const BirthdayScheduler = {
  start: (): void => {
    const cronExpression = "0 * * * *";
    logger.info("[scheduler] starting birthday gift scheduler", {
      cronExpression,
      timezone: process.env.TIMEZONE ?? "America/Sao_Paulo",
    });

    cron.schedule(
      cronExpression,
      async () => {
        logger.info("[scheduler] birthday check triggered by cron job");

        try {
          await BirthdayCheckService.executeBirthdayCheck();
          logger.info("[scheduler] birthday check completed successfully");
        } catch (error) {
          logger.error("[scheduler] birthday check failed", { error });
        }
      },
      {
        timezone: process.env.TIMEZONE ?? "America/Sao_Paulo",
      }
    );

    if (process.env.NODE_ENV === "development") {
      logger.info("[scheduler] running initial birthday check in 5 seconds (dev mode)");
      setTimeout(async () => {
        try {
          await BirthdayCheckService.executeBirthdayCheck();
        } catch (error) {
          logger.error("[scheduler] initial birthday check failed", { error });
        }
      }, 5000);
    }
  },
};
