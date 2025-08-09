import "dotenv/config";
import { createServer } from "./server";
import { startBirthdayWorker } from "./queue/worker";

const port = Number(process.env.API_CORE_PORT ?? 3001);
const host = process.env.API_CORE_HOST ?? "0.0.0.0";

async function main() {
  startBirthdayWorker();

  const app = await createServer();

  try {
    await app.listen({ port, host });
    console.log(`api-core listening on http://${host}:${port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

main();
