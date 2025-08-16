import fastify, { FastifyServerOptions } from "fastify";
import router from "../plugins/router";

export const fastifyAppConfiguration: FastifyServerOptions = {
  logger: true,
  ignoreTrailingSlash: true,
  ignoreDuplicateSlashes: true,
};

export const applicationBuilder = async () => {
  const application = fastify(fastifyAppConfiguration);

  // Rotas
  await application.register(router);

  console.log("Api Simulation built successfully");
  return application;
};
