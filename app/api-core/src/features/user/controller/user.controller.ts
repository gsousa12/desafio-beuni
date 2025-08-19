import { FastifyReply, FastifyRequest } from "fastify";
import { UserRepository } from "../repository/user.repository";
import { ApiErrorResponseType, ApiSuccessResponseType } from "packages/types/dist";
import { encryptPassword } from "app/api-core/src/_shared/utils/utils";
import { CreateUserRequestSchemaType } from "../schemas/request/create.request.schema";
import { OrganizationRepository } from "../../organization/repository/organization.repository";

export const createUserHandler = async (
  request: FastifyRequest<{ Body: CreateUserRequestSchemaType }>,
  reply: FastifyReply
) => {
  const { organization_id, full_name, email, password } = request.body;

  const organization = await OrganizationRepository.getById(organization_id);

  if (!organization) {
    const errorResponse: ApiErrorResponseType = {
      status: "error",
      message: "Organização não encontrada",
    };
    return reply.status(404).send(errorResponse);
  }

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

  const response: ApiSuccessResponseType = {
    status: "success",
    message: "Usuário criado com sucesso",
    meta: {},
    data: [createdUser],
  };

  return reply.status(201).send(response);
};

export const createAdminUserHandler = async (
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

  const response: ApiSuccessResponseType = {
    status: "success",
    message: "Usuário criado com sucesso",
    meta: {},
    data: [createdUser],
  };

  return reply.status(201).send(response);
};
