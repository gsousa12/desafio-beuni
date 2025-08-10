import fastify, { FastifyServerOptions } from "fastify";
import router from "../plugins/router";
import { startBirthdayWorker } from "../queue/worker";
import zodPlugin from "../plugins/zod";
import swaggerPlugin from "../plugins/swagger";
import errorHandlerPlugin from "../plugins/error-handler";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import cors from "../plugins/cors";
import cookie from "@fastify/cookie";
import auth from "../plugins/auth";

export const fastifyAppConfiguration: FastifyServerOptions = {
  logger: false,
  ignoreTrailingSlash: true,
  ignoreDuplicateSlashes: true,
};

export const applicationBuilder = async () => {
  const application = fastify(fastifyAppConfiguration).withTypeProvider<ZodTypeProvider>();

  startBirthdayWorker();

  // Plugins
  await application.register(cors);
  await application.register(cookie, {
    secret: process.env.COOKIE_SECRET,
  });
  await application.register(zodPlugin);
  await application.register(errorHandlerPlugin);
  await application.register(auth);
  await application.register(swaggerPlugin);

  // Rotas
  await application.register(router);

  console.log("Application built successfully");
  return application;
};
