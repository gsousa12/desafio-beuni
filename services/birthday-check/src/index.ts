import "dotenv/config";
import { z } from "zod";
import { BirthdayScheduler } from "./scheduler";
import { GiftWorker } from "./gift-worker";
import logger from "./logger";

const envSchema = z.object({
  REDIS_URL: z.string().nonempty(),
  BIRTHDAY_CHECK_CONCURRENCY: z.string().optional(),
  BIRTHDAY_BATCH_SIZE: z.string().optional(),
  BIRTHDAY_BATCH_DELAY_MS: z.string().optional(),
  TIMEZONE: z.string().optional(),
  NODE_ENV: z.string().default("production"),
});

const env = envSchema.parse(process.env);

const main = async () => {
  logger.info("[core] starting birthday gift service");

  try {
    // Iniciar worker para processar jobs de brinde
    GiftWorker.start(env.BIRTHDAY_CHECK_CONCURRENCY ? Number(env.BIRTHDAY_CHECK_CONCURRENCY) : 5);
    // Iniciar scheduler para verificações automáticas
    BirthdayScheduler.start();

    logger.info("[core] birthday gift service started successfully");

    // Graceful shutdown
    const shutdown = async (signal: string) => {
      logger.info(`[core] received ${signal}, shutting down gracefully`);

      try {
        await GiftWorker.shutdown();
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
