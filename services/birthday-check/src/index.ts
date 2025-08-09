import "dotenv/config";
import { z } from "zod";
import { startProducer } from "./producer";
import { startWorker } from "./worker";

const envSchema = z.object({
  REDIS_URL: z.string().nonempty(),
  BIRTHDAY_QUEUE_NAME: z.string().default("birthday-queue"),
  BIRTHDAY_CHECK_CONCURRENCY: z.string().optional(),
});

const env = envSchema.parse(process.env);

async function main() {
  console.log("birthday-check starting with env:", {
    queue: env.BIRTHDAY_QUEUE_NAME,
    redis: env.REDIS_URL,
  });

  // Inicia um produtor fake (apenas para validação do setup).
  // Ele vai enfileirar um job a cada 10s.
  startProducer();

  // Worker opcional de exemplo (pode manter aqui só para sanity check)
  startWorker();
}

main().catch((err) => {
  console.error("birthday-check failed to start:", err);
  process.exit(1);
});
