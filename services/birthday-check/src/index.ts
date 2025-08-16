import "dotenv/config";
import { BirthdayScheduler } from "./services/scheduler";
import logger from "./services/logger";

const main = async () => {
  logger.info("[core] starting birthday check service");

  try {
    BirthdayScheduler.start();

    logger.info("[core] birthday check service started successfully");

    const shutdown = async (signal: string) => {
      logger.info(`[core] received ${signal}, shutting down gracefully`);

      try {
        logger.info("[core] service stopped successfully");
        process.exit(0);
      } catch (error) {
        logger.error("[core] error during shutdown", { error });
        process.exit(1);
      }
    };

    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));
  } catch (error) {
    logger.error("[core] failed to start service", { error });
    process.exit(1);
  }
};

main();
