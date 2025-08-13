import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";

export const employeeRoutes = async (fastify: FastifyInstance) => {
  const app = fastify.withTypeProvider<ZodTypeProvider>();

  // app.route({
  //   method: "POST",
  //   url: "/create",
  //   schema: {
  //     summary: "Criar colaborador",
  //     description: "Cria um novo colaborador no sistema",
  //     tags: ["Employee"],
  //     body: createEmployeeRequestSchema,
  //     response: createEmployeeResponseSchema,
  //   },
  //   preHandler: app.authenticate,
  //   handler: createEmployeeHandler,
  // });
};
