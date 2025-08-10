import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { createUserHandler } from "../controller/user.controller.js";
import { createUserRequestSchema } from "../schemas/user.body.schema.js";
import { createUserResponseSchema } from "../schemas/user.response.schema.js";

export const userRoutes = async (fastify: FastifyInstance) => {
  const app = fastify.withTypeProvider<ZodTypeProvider>();
  app.route({
    method: "POST",
    url: "/create",
    schema: {
      description: "Cria um novo usuário beuni no sistema",
      body: createUserRequestSchema,
      response: createUserResponseSchema,
      tags: ["User"],
      summary: "Criar usuário",
    },
    preHandler: app.authenticate,
    handler: createUserHandler,
  });
};
