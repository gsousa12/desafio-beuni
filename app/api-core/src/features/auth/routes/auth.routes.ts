import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { loginHandler, logoutHandler } from "../controller/auth.controller";
import { loginRequestSchema } from "../schemas/auth.body.schema";
import { loginResponseSchema } from "../schemas/auth.response.schema";

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
    schema: {
      summary: "Logar usuário",
      description: "Loga um usuário beuni no sistema",
      tags: ["Auth"],
    },
    preHandler: [fastify.authenticate],
    handler: logoutHandler,
  });
};
