import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import {
  createAddressHandler,
  createOrganizationHandler,
} from "../controller/organization.controller";
import { createOrganizationRequestSchema } from "../schemas/request/create.request.schema";
import { createOrganizationResponseSchema } from "../schemas/response/create.response.schema";
import { createAdressResponseSchema } from "../schemas/response/create-address.request.schema";
import { createAddressRequestSchema } from "../schemas/request/create-address.request.schema";

export const organizationRoutes = async (fastify: FastifyInstance) => {
  const app = fastify.withTypeProvider<ZodTypeProvider>();

  app.route({
    method: "POST",
    url: "/create",
    schema: {
      summary: "Criar organização",
      description: "Cria uma nova organização (cliente beuni) no sistema",
      tags: ["Organization"],
      body: createOrganizationRequestSchema,
      response: createOrganizationResponseSchema,
    },
    handler: createOrganizationHandler,
  });

  app.route({
    method: "POST",
    url: "/create-address",
    schema: {
      summary: "Criar endereço",
      description: "Cadastra um endereço para a organização",
      tags: ["User"],
      body: createAddressRequestSchema,
      response: createAdressResponseSchema,
    },
    preHandler: app.authenticate,
    handler: createAddressHandler,
  });
};
