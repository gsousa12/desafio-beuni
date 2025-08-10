import { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import fastifyCors from "@fastify/cors";

const corsPlugin: FastifyPluginAsync = async (fastify) => {
  const allowedOrigin = process.env.CORS_ORIGIN || "http://localhost:5173";

  await fastify.register(fastifyCors, {
    origin: allowedOrigin,
    credentials: true,
  });
};

export default fp(corsPlugin, {
  name: "cors-setup",
  fastify: "4.x",
});
