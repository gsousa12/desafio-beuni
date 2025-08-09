import fastify, { FastifyServerOptions } from "fastify";
import router from "../plugins/router";
import { startBirthdayWorker } from "../queue/worker";

export const fastifyAppConfiguration: FastifyServerOptions = {
  logger: true,
  ignoreTrailingSlash: true,
  ignoreDuplicateSlashes: true,
};

export const applicationBuilder = async () => {
  const application = fastify();
  startBirthdayWorker();

  application.register(router);

  return application;
};
