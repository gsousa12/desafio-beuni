import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { createDepartmentHandler } from "../controller/department.controller";
import { createDepartmentRequestSchema } from "../schemas/request/create.request.schema";
import { createDepartmentResponseSchema } from "../schemas/response/create.response.schema";

export const departmentRoutes = async (fastify: FastifyInstance) => {
  // const app = fastify.withTypeProvider<ZodTypeProvider>();
  // app.route({
  //   method: "POST",
  //   url: "/create",
  //   schema: {
  //     summary: "Criar departamento",
  //     description: "Cria um novo departamento no sistema",
  //     tags: ["Department"],
  //     body: createDepartmentRequestSchema,
  //     response: createDepartmentResponseSchema,
  //   },
  //   preHandler: app.authenticate,
  //   handler: createDepartmentHandler,
  // });
};
