import { FastifyReply, FastifyRequest } from "fastify";
import { UserRepository } from "../repository/user.repository";
import { ApiErrorResponseType, ApiSucessResponseType } from "packages/types/dist";
import {
  CreateAddressRequestSchemaType,
  CreateUserRequestSchemaType,
} from "../schemas/user.body.schema";
import { encryptPassword } from "app/api-core/src/_shared/utils/utils";

export const createUserHandler = async (
  request: FastifyRequest<{ Body: CreateUserRequestSchemaType }>,
  reply: FastifyReply
) => {
  const { full_name, email, password } = request.body;
  // const cronometer = new Date();

  try {
    const user = await UserRepository.getByEmail(email);

    if (user) {
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
  } finally {
  }
};

export const createAddressHandler = async (
  request: FastifyRequest<{ Body: CreateAddressRequestSchemaType }>,
  reply: FastifyReply
) => {
  const userId = request.user.id;
  const { state, city, neighborhood, street, zip_code, number } = request.body;
  try {
    const user = await UserRepository.getById(userId);

    if (!user) {
      const errorResponse: ApiErrorResponseType = {
        status: "error",
        message: "Usuário não encontrado",
      };
      return reply.status(404).send(errorResponse);
    }

    const existingAddress = await UserRepository.getAddressByUserId(userId);

    if (existingAddress) {
      const errorResponse: ApiErrorResponseType = {
        status: "error",
        message: "Usuário já possui um endereço cadastrado",
      };
      return reply.status(400).send(errorResponse);
    }

    const data = { state, city, neighborhood, street, zip_code, number };

    const createdAddress = await UserRepository.createAddress(userId, data);

    const response: ApiSucessResponseType = {
      status: "success",
      message: "Endereço criado com sucesso",
      meta: {},
      data: [createdAddress],
    };
    return reply.status(201).send(response);
  } catch (error) {
  } finally {
  }
};
