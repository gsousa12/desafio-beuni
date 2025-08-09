import Fastify from "fastify";
import { prisma } from "@packages/prisma";
import healthRoutes from "./routes/health";

export async function createServer() {
  const app = Fastify({
    logger: true,
  });

  app.addHook("onReady", async () => {
    try {
      await prisma.$queryRaw`SELECT 1`;
      app.log.info("Database connection OK");
    } catch (e) {
      app.log.error({ err: e }, "Database connection FAILED");
    }
  });

  app.register(healthRoutes, { prefix: "/health" });

  return app;
}
