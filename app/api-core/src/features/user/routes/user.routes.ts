import { FastifyInstance } from "fastify";
import { createUserHandler } from "../controller/user.controller";
import { createUserRequestSchema } from "../schemas/user.body.schema";
import { createUserResponseSchema } from "../schemas/user.response.schema";

export const userRoutes = async (fastify: FastifyInstance) => {
  fastify.route({
    method: "POST",
    url: "/create",
    preHandler: [],
    handler: createUserHandler,
    // schema: {
    //   description: "Cria um novo usuário beuni no sistema",
    //   body: createUserRequestSchema,
    //   response: createUserResponseSchema,
    // },
  });
};
