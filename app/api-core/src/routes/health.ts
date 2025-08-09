import { FastifyInstance, FastifyPluginOptions } from "fastify";

export default async function routes(app: FastifyInstance, _opts: FastifyPluginOptions) {
  app.get("/", async () => {
    return {
      ok: true,
      service: "api-core",
      env: process.env.NODE_ENV ?? "development",
      db: process.env.DATABASE_URL ? "configured" : "missing",
      time: new Date().toISOString(),
    };
  });
}
