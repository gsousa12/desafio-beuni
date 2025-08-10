import fastify, { FastifyServerOptions } from "fastify";
import router from "../plugins/router";
import { startBirthdayWorker } from "../queue/worker";
import zodPlugin from "../plugins/zod";
import swaggerPlugin from "../plugins/swagger";
import errorHandlerPlugin from "../plugins/error-handler";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

export const fastifyAppConfiguration: FastifyServerOptions = {
  logger: true,
  ignoreTrailingSlash: true,
  ignoreDuplicateSlashes: true,
};

export const applicationBuilder = async () => {
  const application = fastify(fastifyAppConfiguration).withTypeProvider<ZodTypeProvider>();

  startBirthdayWorker();

  // Plugins
  await application.register(zodPlugin);
  await application.register(errorHandlerPlugin);
  await application.register(swaggerPlugin);

  // Rotas
  await application.register(router);

  return application;
};
