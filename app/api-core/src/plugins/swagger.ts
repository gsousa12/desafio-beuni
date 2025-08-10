import fp from "fastify-plugin";
import { FastifyInstance } from "fastify";
import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";
import { jsonSchemaTransform } from "./zod.js";

export default fp(
  async function swaggerPlugin(app: FastifyInstance) {
    await app.register(swagger, {
      openapi: {
        info: {
          title: "api-core",
          description: "API core do Desafio Beuni",
          version: "1.0.0",
        },
        servers: [{ url: "/", description: "default" }],
      },
      transform: jsonSchemaTransform,
    });

    await app.register(swaggerUI, {
      routePrefix: "/docs",
      uiConfig: { docExpansion: "list", deepLinking: true },
      staticCSP: true,
    });
  },
  { name: "swagger-plugin" }
);
