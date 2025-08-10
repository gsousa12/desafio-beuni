import { FastifyReply, FastifyRequest } from "fastify";
import { UserRepository } from "../repository/user.repository";
import { ApiErrorResponseType, ApiSucessResponseType } from "packages/types/dist";
import { CreateUserRequestSchemaType } from "../schemas/user.body.schema";
import { encryptPassword, getExecutionTimeSeconds } from "app/api-core/src/_shared/utils/utils";

export const createUserHandler = async (
  request: FastifyRequest<{ Body: CreateUserRequestSchemaType }>,
  reply: FastifyReply
) => {
  const { full_name, email, password } = request.body;
  // const cronometer = new Date();

  try {
    const existingUser = await UserRepository.getByEmail(email);

    if (existingUser) {
      const errorResponse: ApiErrorResponseType = {
        status: "error",
        message: "Já existe um usuário cadastrado com esse email",
      };
      return reply.status(400).send(errorResponse);
    }

    const hashedPassword = await encryptPassword(password);

    const data = { full_name, email, hashedPassword };

    const createdUser = await UserRepository.create(data);

    const response: ApiSucessResponseType = {
      status: "success",
      message: "Usuário criado com sucesso",
      meta: {},
      data: [createdUser],
    };

    return reply.status(201).send(response);
  } catch (error) {
    // const errorMetrics = {
    //   executionTimeSeconds: getExecutionTimeSeconds(cronometer),
    //   requestId: request.id,
    //   method: request.method,
    //   url: request.url,
    //   statusCode: reply.statusCode,
    //   body: request.body,
    //   headers: request.headers,
    //   error: error instanceof Error ? error.message : String(error),
    // };
    // console.error("Error Metrics:", errorMetrics);
  } finally {
    // const metrics = {
    //   executionTimeSeconds: getExecutionTimeSeconds(cronometer),
    //   requestIp: request.ip,
    //   requestId: request.id,
    //   method: request.method,
    //   url: request.url,
    //   statusCode: reply.statusCode,
    //   body: request.body,
    //   headers: request.headers,
    //   query: request.query,
    //   params: request.params,
    // };
    // console.info("Request Metrics:", metrics);
  }
};
