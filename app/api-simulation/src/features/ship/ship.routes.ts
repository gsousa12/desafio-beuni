import { FastifyInstance } from "fastify";
import { shipGiftHandler } from "./ship.controller";

export const shipRoutes = async (fastify: FastifyInstance) => {
  fastify.route({
    method: "POST",
    url: "/",
    handler: shipGiftHandler,
  });
};
