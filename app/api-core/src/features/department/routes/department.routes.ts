import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import {
  createDepartmentHandler,
  getAllDepartmentHandler,
} from "../controller/department.controller";
import { createDepartmentRequestSchema } from "../schemas/request/create.request.schema";
import { createDepartmentResponseSchema } from "../schemas/response/create.response.schema";
import { getAllDepartmentRequestSchema } from "../schemas/request/get-all.request.schema";
import { getAllDepartmentResponseSchema } from "../schemas/response/get-all.response.schema";

export const departmentRoutes = async (fastify: FastifyInstance) => {
  const app = fastify.withTypeProvider<ZodTypeProvider>();
  app.route({
    method: "POST",
    url: "/",
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

  app.route({
    method: "GET",
    url: "/",
    schema: {
      summary: "Retorna os departamentos",
      description: "Retorna todos os departamento de uma organização de forma paginada",
      tags: ["Department"],
      querystring: getAllDepartmentRequestSchema,
      response: getAllDepartmentResponseSchema,
    },
    preHandler: app.authenticate,
    handler: getAllDepartmentHandler,
  });
};
