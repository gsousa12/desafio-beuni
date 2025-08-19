import { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { createAdminUserHandler, createUserHandler } from "../controller/user.controller.js";
import { createUserRequestSchema } from "../schemas/request/create.request.schema.js";
import { createUserResponseSchema } from "../schemas/response/create.response.schema.js";

export const userRoutes = async (fastify: FastifyInstance) => {
  const app = fastify.withTypeProvider<ZodTypeProvider>();

  app.route({
    method: "POST",
    url: "/",
    schema: {
      summary: "Criar usuário",
      description: "Cria um novo usuário beuni no sistema",
      tags: ["User"],
      body: createUserRequestSchema,
      response: createUserResponseSchema,
    },
    handler: createUserHandler,
  });

  // app.route({
  //   method: "POST",
  //   url: "/create-admin",
  //   schema: {
  //     summary: "Criar usuário administrador",
  //     description: "Cria um novo usuário beuni administrador de uma organização no sistema",
  //     tags: ["User"],
  //     body: createUserRequestSchema,
  //     response: createUserResponseSchema,
  //   },
  //   handler: createAdminUserHandler,
  // });
};
