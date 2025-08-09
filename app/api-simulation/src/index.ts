import "dotenv/config";
import { createServer } from "./server";

const port = Number(process.env.API_SIM_PORT ?? 3002);
const host = process.env.API_SIM_HOST ?? "0.0.0.0";

async function main() {
  const app = await createServer();

  try {
    await app.listen({ port, host });
    console.log(`api-simulation listening on http://${host}:${port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

main();
