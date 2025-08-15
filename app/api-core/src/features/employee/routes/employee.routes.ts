import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { createEmployeeRequestSchema } from "../schemas/request/create.request.schema";
import { createEmployeeResponseSchema } from "../schemas/response/create.response.schema";
import { createEmployeeHandler, getAllEmployeeHandler } from "../controller/employee.controller";
import { getAllEmployeeRequestSchema } from "../schemas/request/get-all-employee.request.schema";
import { getAllEmployeeResponseSchema } from "../schemas/response/get-all-employee.response.schema";

export const employeeRoutes = async (fastify: FastifyInstance) => {
  const app = fastify.withTypeProvider<ZodTypeProvider>();

  app.route({
    method: "POST",
    url: "/create",
    schema: {
      summary: "Criar colaborador",
      description: "Cria um novo colaborador no sistema",
      tags: ["Employee"],
      body: createEmployeeRequestSchema,
      response: createEmployeeResponseSchema,
    },
    preHandler: app.authenticate,
    handler: createEmployeeHandler,
  });

  app.route({
    method: "GET",
    url: "/",
    schema: {
      summary: "Todos os colaboradores",
      description: "Retorna todos os colaboradores do sistema de forma paginada",
      tags: ["Employee"],
      querystring: getAllEmployeeRequestSchema,
      response: getAllEmployeeResponseSchema,
    },
    preHandler: app.authenticate,
    handler: getAllEmployeeHandler,
  });
};
