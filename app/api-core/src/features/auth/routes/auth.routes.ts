import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { loginHandler, logoutHandler, ValidateHandler } from "../controller/auth.controller";
import { loginResponseSchema } from "../schemas/response/login.response.schema";
import { loginRequestSchema } from "../schemas/request/login.request.schema";
import { validateResponseSchema } from "../schemas/response/validate.response.schema";

export const authRoutes = async (fastify: FastifyInstance) => {
  const app = fastify.withTypeProvider<ZodTypeProvider>();

  app.route({
    method: "POST",
    url: "/login",
    handler: loginHandler,
    schema: {
      summary: "Logar usuário",
      description: "Loga um usuário beuni no sistema",
      tags: ["Auth"],
      body: loginRequestSchema,
      response: loginResponseSchema,
    },
  });

  app.route({
    method: "POST",
    url: `/logout`,
    preHandler: fastify.authenticate,
    handler: logoutHandler,
    schema: {
      summary: "Logar usuário",
      description: "Loga um usuário beuni no sistema",
      tags: ["Auth"],
    },
  });

  app.route({
    method: "POST",
    url: "/validate",
    preHandler: fastify.authenticate,
    handler: ValidateHandler,
    schema: {
      summary: "Validar JWT",
      description: "Valida o JWT e retorna o usuário autenticado",
      tags: ["Auth"],
      response: validateResponseSchema,
    },
  });
};
