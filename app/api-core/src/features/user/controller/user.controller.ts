import { FastifyReply, FastifyRequest } from "fastify";
import { UserRepository } from "../repository/user.repository";
import { ApiErrorResponseType, ApiSucessResponseType } from "packages/types/dist";
import { CreateUserRequestSchemaType } from "../schemas/user.body.schema";

export const createUserHandler = async (
  request: FastifyRequest<{ Body: CreateUserRequestSchemaType }>,
  reply: FastifyReply
) => {
  const requestTimer = Date.now();
  const { full_name, email, password } = request.body;
  try {
    const data = {
      full_name,
      email,
      password,
    };

    const existingUser = await UserRepository.getByEmail(email);

    if (existingUser) {
      const errorResponse: ApiErrorResponseType = {
        status: "error",
        message: "Já existe um usuário cadastrado com esse email",
      };
      return reply.status(400).send(errorResponse);
    }

    await UserRepository.create(data);

    const response: ApiSucessResponseType = {
      status: "success",
      message: "Usuário criado com sucesso",
      meta: {
        request_time: Date.now() - requestTimer,
        request_id: request.id,
      },
      data: [],
    };

    reply.status(201).send(response);
  } catch (error) {
    throw error;
  } finally {
    // Logs Futuros
  }
};
