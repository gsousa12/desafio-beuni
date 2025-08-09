import { FastifyInstance, FastifyPluginOptions } from "fastify";

export default async function routes(app: FastifyInstance, _opts: FastifyPluginOptions) {
  app.get("/", async () => {
    return {
      ok: true,
      service: "api-simulation",
      env: process.env.NODE_ENV ?? "development",
      time: new Date().toISOString(),
    };
  });
}
