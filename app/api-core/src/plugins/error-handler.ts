import fp from "fastify-plugin";
import { FastifyInstance } from "fastify";
import { ZodError } from "zod";

type ErrorPayload = {
  status: "error";
  message: string;
};

export default fp(
  async function errorHandlerPlugin(app: FastifyInstance) {
    app.setErrorHandler((err, request, reply) => {
      if (err instanceof ZodError) {
        const firstIssue = err.issues[0];

        if (firstIssue) {
          const payload: ErrorPayload = {
            status: "error",
            message: firstIssue.message,
          };

          reply.code(400).send(payload);
          return;
        }
      }

      if (err.message && err.message.includes(",")) {
        const firstMessage = err.message.split(",")[0]?.trim() ?? "";

        const payload: ErrorPayload = {
          status: "error",
          message: firstMessage || "Erro de validação",
        };

        reply.code(400).send(payload);
        return;
      }

      const statusCode =
        typeof (err as any).statusCode === "number" ? (err as any).statusCode : undefined;

      if (statusCode && statusCode >= 400 && statusCode < 600) {
        const payload: ErrorPayload = {
          status: "error",
          message: err.message || "Ocorreu um erro",
        };
        reply.code(statusCode).send(payload);
        return;
      }

      const payload: ErrorPayload = {
        status: "error",
        message: process.env.NODE_ENV === "production" ? "Erro interno no servidor" : err.message,
      };
      reply.code(500).send(payload);
    });
  },
  { name: "error-handler-plugin" }
);
