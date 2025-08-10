import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { createDepartmentRequestSchema } from "../schemas/department.body.schema";
import { createDepartmentHandler } from "../controller/department.controller";
import { createDepartmentResponseSchema } from "../schemas/department.response.schema";

export const departmentRoutes = async (fastify: FastifyInstance) => {
  const app = fastify.withTypeProvider<ZodTypeProvider>();

  app.route({
    method: "POST",
    url: "/create",
    schema: {
      summary: "Criar departamento",
      description: "Cria um novo departamento no sistema",
      tags: ["Department"],
      body: createDepartmentRequestSchema,
      response: createDepartmentResponseSchema,
    },
    preHandler: app.authenticate,
    handler: createDepartmentHandler,
  });
};
