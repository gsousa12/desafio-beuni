import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { createAddressHandler, createUserHandler } from "../controller/user.controller.js";
import {
  createAddressRequestSchema,
  createUserRequestSchema,
} from "../schemas/user.body.schema.js";
import {
  createAdressResponseSchema,
  createUserResponseSchema,
} from "../schemas/user.response.schema.js";

export const userRoutes = async (fastify: FastifyInstance) => {
  const app = fastify.withTypeProvider<ZodTypeProvider>();
  app.route({
    method: "POST",
    url: "/create",
    schema: {
      summary: "Criar usuário",
      description: "Cria um novo usuário beuni no sistema",
      tags: ["User"],
      body: createUserRequestSchema,
      response: createUserResponseSchema,
    },
    handler: createUserHandler,
  });

  app.route({
    method: "POST",
    url: "/create-address",
    schema: {
      summary: "Criar endereço",
      description: "Cadastra um endereço para o usuário",
      tags: ["User"],
      body: createAddressRequestSchema,
      response: createAdressResponseSchema,
    },
    preHandler: app.authenticate,
    handler: createAddressHandler,
  });
};
