import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import fp from "fastify-plugin";
import fastifyJwt from "@fastify/jwt";
import { JwtPayloadType } from "packages/types/dist";

declare module "fastify" {
  export interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: JwtPayloadType;
    user: JwtPayloadType;
  }
}

const authPlugin = async (app: FastifyInstance) => {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error("JWT_SECRET não está definido nas variáveis de ambiente.");
  }

  await app.register(fastifyJwt, {
    secret: jwtSecret,
    cookie: {
      cookieName: "token",
      signed: false,
    },
    sign: {
      expiresIn: "8h",
    },
  });

  app.decorate("authenticate", async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.status(401).send({
        status: "error",
        message: "Você não possui autorização para realizar essa ação.",
      });
      throw err;
    }
  });
};

export default fp(authPlugin, {
  name: "auth-plugin",
  // Remova a linha dependencies completamente
});
