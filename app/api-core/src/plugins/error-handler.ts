import fp from "fastify-plugin";
import { FastifyInstance } from "fastify";
import { ZodError } from "zod";
import { Prisma } from "packages/prisma/dist";

type ErrorPayload = {
  status: "error";
  message: string;
};

export default fp(
  async function errorHandlerPlugin(app: FastifyInstance) {
    app.setErrorHandler((err, request, reply) => {
      // Log do erro para debugging (opcional)
      app.log.error(err);

      // 1. Tratamento de erros do Zod (validação)
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

      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (process.env.NODE_ENV !== "production") {
          console.error("Prisma Error:", err);
        }

        const payload: ErrorPayload = {
          status: "error",
          message: "Ocorreu um erro no servidor",
        };

        reply.code(500).send(payload);
        return;
      }

      if (err instanceof Prisma.PrismaClientUnknownRequestError) {
        const payload: ErrorPayload = {
          status: "error",
          message: "Ocorreu um erro no servidor",
        };

        reply.code(500).send(payload);
        return;
      }

      if (err instanceof Prisma.PrismaClientValidationError) {
        const payload: ErrorPayload = {
          status: "error",
          message: "Dados de entrada inválidos",
        };

        reply.code(400).send(payload);
        return;
      }

      if (err instanceof Prisma.PrismaClientInitializationError) {
        const payload: ErrorPayload = {
          status: "error",
          message: "Erro de conexão com o banco de dados",
        };

        reply.code(503).send(payload);
        return;
      }

      if (err instanceof Prisma.PrismaClientRustPanicError) {
        const payload: ErrorPayload = {
          status: "error",
          message: "Ocorreu um erro crítico no servidor",
        };

        reply.code(500).send(payload);
        return;
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
        message:
          process.env.NODE_ENV === "production" ? "Ocorreu um erro no servidor" : err.message,
      };
      reply.code(500).send(payload);
    });
  },
  { name: "error-handler-plugin" }
);
