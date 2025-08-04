import fastify from "fastify";

export const builder = async () => {
  const application = fastify();

  application.get("/ping", async (request, reply) => {
    return "pong\n";
  });

  return application;
};
