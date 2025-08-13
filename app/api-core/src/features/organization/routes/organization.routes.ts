import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import {
  createAddressRequestSchema,
  createOrganizationRequestSchema,
} from "../schemas/organization.body.schemas";
import {
  createAdressResponseSchema,
  createOrganizationResponseSchema,
} from "../schemas/organization.response.schemas";
import {
  createAddressHandler,
  createOrganizationHandler,
} from "../controller/organization.controller";

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
