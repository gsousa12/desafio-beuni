import { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { createUserHandler } from "../controller/user.controller.js"; // .js para ESM
import { createUserRequestSchema } from "../schemas/user.body.schema.js";
import { createUserResponseSchema } from "../schemas/user.response.schema.js";

export const userRoutes = async (fastify: FastifyInstance) => {
  const app = fastify.withTypeProvider<ZodTypeProvider>();

  app.route({
    method: "POST",
    url: "/create",
    handler: createUserHandler,
    schema: {
      description: "Cria um novo usuário beuni no sistema",
      body: createUserRequestSchema,
      response: createUserResponseSchema,
      tags: ["User"],
      summary: "Criar usuário",
    },
  });
};
