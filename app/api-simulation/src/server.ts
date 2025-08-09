import Fastify from "fastify";
import healthRoutes from "./routes/health";
import shipRoutes from "./routes/ship";

export async function createServer() {
  const app = Fastify({
    logger: true,
  });

  app.register(healthRoutes, { prefix: "/health" });
  app.register(shipRoutes, { prefix: "/ship" });

  return app;
}
