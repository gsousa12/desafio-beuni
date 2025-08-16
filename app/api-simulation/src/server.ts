import { applicationBuilder } from "./builder/application.builder";

const port = Number(process.env.API_SIM_PORT ?? 3002);
const host = process.env.API_SIM_HOST ?? "0.0.0.0";

async function main() {
  const application = await applicationBuilder();

  try {
    await application.listen({ port, host });
    console.log(`api-core listening on http://${host}:${port}`);
  } catch (err) {
    application.log.error(err);
    process.exit(1);
  }
}

main();
