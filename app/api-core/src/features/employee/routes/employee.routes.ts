import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { createEmployeeRequestSchema } from "../schemas/request/create.request.schema";
import { createDepartmentResponseSchema } from "../schemas/response/create.response.schema";
import { createEmployeeHandler } from "../controller/employee.controller";

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
      response: createDepartmentResponseSchema,
    },
    preHandler: app.authenticate,
    handler: createEmployeeHandler,
  });
};
