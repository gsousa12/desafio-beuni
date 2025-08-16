import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { createEmployeeRequestSchema } from "../schemas/request/create.request.schema";
import { createEmployeeResponseSchema } from "../schemas/response/create.response.schema";
import {
  createEmployeeHandler,
  deleteEmployeeHandler,
  editEmployeeHandler,
  getAllEmployeeHandler,
  getEmployeeHandler,
} from "../controller/employee.controller";
import { getAllEmployeeRequestSchema } from "../schemas/request/get-all.request.schema";
import { getAllEmployeeResponseSchema } from "../schemas/response/get-all.response.schema";
import { getEmployeeRequestSchema } from "../schemas/request/get-by-id.request.schema";
import { getEmployeeResponseSchema } from "../schemas/response/get-by-id.response.schema";
import { deleteEmployeeRequestSchema } from "../schemas/request/delete.request.schema";
import { deleteEmployeeResponseSchema } from "../schemas/response/delete.response.schema";
import {
  editEmployeeRequestBodySchema,
  editEmployeeRequestParamSchema,
} from "../schemas/request/edit.request.schema";
import { editEmployeeResponseSchema } from "../schemas/response/edit.response.schema";

export const employeeRoutes = async (fastify: FastifyInstance) => {
  const app = fastify.withTypeProvider<ZodTypeProvider>();

  app.route({
    method: "POST",
    url: "/",
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
      summary: "Retorna os colaboradores",
      description: "Retorna todos os colaboradores de uma organização de forma paginada",
      tags: ["Employee"],
      querystring: getAllEmployeeRequestSchema,
      response: getAllEmployeeResponseSchema,
    },
    preHandler: app.authenticate,
    handler: getAllEmployeeHandler,
  });

  app.route({
    method: "GET",
    url: "/:id",
    schema: {
      summary: "Retorna um colaborador específico",
      description: "Retorna um colaborador específico de uma organização",
      tags: ["Employee"],
      params: getEmployeeRequestSchema,
      response: getEmployeeResponseSchema,
    },
    preHandler: app.authenticate,
    handler: getEmployeeHandler,
  });

  app.route({
    method: "DELETE",
    url: "/:id",
    schema: {
      summary: "Deleta um colaborador específico",
      description: "Deleta um colaborador específico de uma organização",
      tags: ["Employee"],
      params: deleteEmployeeRequestSchema,
      response: deleteEmployeeResponseSchema,
    },
    preHandler: app.authenticate,
    handler: deleteEmployeeHandler,
  });

  app.route({
    method: "PUT",
    url: "/:id",
    schema: {
      summary: "Edita um colaborador específico",
      description: "Edita um colaborador específico de uma organização",
      tags: ["Employee"],
      params: editEmployeeRequestParamSchema,
      body: editEmployeeRequestBodySchema,
      response: editEmployeeResponseSchema,
    },
    preHandler: app.authenticate,
    handler: editEmployeeHandler,
  });
};
