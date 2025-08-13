import { FastifyReply, FastifyRequest } from "fastify";
import { UserRepository } from "../repository/user.repository";
import { ApiErrorResponseType, ApiSucessResponseType } from "packages/types/dist";
import { CreateUserRequestSchemaType } from "../schemas/user.body.schema";
import { encryptPassword } from "app/api-core/src/_shared/utils/utils";

export const createUserHandler = async (
  request: FastifyRequest<{ Body: CreateUserRequestSchemaType }>,
  reply: FastifyReply
) => {
  const { organization_id, full_name, email, password } = request.body;
  const user = await UserRepository.getByEmail(email);

  if (user) {
    const errorResponse: ApiErrorResponseType = {
      status: "error",
      message: "Já existe um usuário cadastrado com esse email",
    };
    return reply.status(400).send(errorResponse);
  }

  const hashedPassword = await encryptPassword(password);

  const data = { organization_id, full_name, email, hashedPassword };

  const createdUser = await UserRepository.create(data);

  const response: ApiSucessResponseType = {
    status: "success",
    message: "Usuário criado com sucesso",
    meta: {},
    data: [createdUser],
  };

  return reply.status(201).send(response);
};
