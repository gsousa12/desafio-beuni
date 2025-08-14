import "dotenv/config";
import { z } from "zod";
import { BirthdayScheduler } from "./scheduler";
import { BirthdayWorker } from "./worker";

const envSchema = z.object({
  REDIS_URL: z.string().nonempty(),
  BIRTHDAY_QUEUE_NAME: z.string().default("birthday-queue"),
  BIRTHDAY_CHECK_CONCURRENCY: z.string().optional(),
  BIRTHDAY_BATCH_SIZE: z.string().optional(),
  BIRTHDAY_BATCH_DELAY_MS: z.string().optional(),
  TIMEZONE: z.string().optional(),
  NODE_ENV: z.string().default("production"),
});

const env = envSchema.parse(process.env);

let worker: any;

const main = async () => {
  console.log("🎂 Birthday Check Service starting...");
  console.log("Configuration:", {
    queue: env.BIRTHDAY_QUEUE_NAME,
    redis: env.REDIS_URL,
    concurrency: env.BIRTHDAY_CHECK_CONCURRENCY ?? "5",
    batchSize: env.BIRTHDAY_BATCH_SIZE ?? "100",
    batchDelay: env.BIRTHDAY_BATCH_DELAY_MS ?? "1000ms",
    timezone: env.TIMEZONE ?? "America/Sao_Paulo",
    environment: env.NODE_ENV,
  });

  try {
    // Iniciar o worker para processar jobs
    console.log("🔄 Starting birthday worker...");
    worker = BirthdayWorker.start(
      env.BIRTHDAY_CHECK_CONCURRENCY ? Number(env.BIRTHDAY_CHECK_CONCURRENCY) : undefined
    );

    // Iniciar o scheduler para agendar verificações
    console.log("⏰ Starting birthday scheduler...");
    BirthdayScheduler.start();

    console.log("✅ Birthday Check Service started successfully");
    console.log("📋 Worker listening for birthday jobs");
    console.log("⏱️  Scheduler will run every 12 hours (00:00 and 12:00)");

    // No ambiente de desenvolvimento, mostrar informações adicionais
    if (env.NODE_ENV === "development") {
      console.log("🔧 Development mode: Initial birthday check will run in 5 seconds");
    }
  } catch (error) {
    console.error("❌ Failed to start Birthday Check Service:", error);
    process.exit(1);
  }
};

// Graceful shutdown
const shutdown = async (signal: string) => {
  console.log(`\n🔄 Received ${signal}, shutting down gracefully...`);

  try {
    if (worker) {
      console.log("🔄 Stopping birthday worker...");
      await BirthdayWorker.shutdown(worker);
    }

    console.log("✅ Birthday Check Service stopped successfully");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error during shutdown:", error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  console.error("💥 Uncaught Exception:", error);
  shutdown("UNCAUGHT_EXCEPTION");
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("💥 Unhandled Rejection at:", promise, "reason:", reason);
  shutdown("UNHANDLED_REJECTION");
});

// Start the service
main().catch((err) => {
  console.error("💥 Birthday Check Service crashed:", err);
  process.exit(1);
});
