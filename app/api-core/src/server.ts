import "dotenv/config";
import { applicationBuilder } from "./builders/application.builder";
import { GiftProcessor } from "./integrations/shipping/processor/gift-processor";

const port = Number(process.env.API_CORE_PORT ?? 3001);
const host = process.env.API_CORE_HOST ?? "0.0.0.0";

async function main() {
  const application = await applicationBuilder();
  await GiftProcessor.start(10); // concorrência baixa
  try {
    await application.listen({ port, host });
    console.log(`api-core listening on http://${host}:${port}`);
  } catch (err) {
    application.log.error(err);
    process.exit(1);
  }
}

main();
