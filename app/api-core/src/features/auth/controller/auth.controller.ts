import { FastifyReply, FastifyRequest } from "fastify";
import { UserRepository } from "../../user/repository/user.repository";
import { ApiErrorResponseType, ApiSucessResponseType, JwtPayloadType } from "packages/types/dist";
import { matchPassword } from "app/api-core/src/_shared/utils/utils";
import { loginRequestSchemaType } from "../schemas/request/login.request.schema";

export const loginHandler = async (
  request: FastifyRequest<{ Body: loginRequestSchemaType }>,
  reply: FastifyReply
) => {
  const { email, password } = request.body;
  const existingUser = await UserRepository.getByEmail(email);
  if (!existingUser) {
    const errorResponse: ApiErrorResponseType = {
      status: "error",
      message: "Nenhum usuário encontrado com esse email",
    };
    return reply.status(400).send(errorResponse);
  }

  const match = await matchPassword(password, existingUser.hash_password);
  if (!match) {
    const errorResponse: ApiErrorResponseType = {
      status: "error",
      message: "Credenciais inválidas",
    };
    return reply.status(400).send(errorResponse);
  }

  console.log(existingUser);

  const jwtPayload: JwtPayloadType = {
    id: existingUser.id,
    organization_id: existingUser.organization_id,
    name: existingUser.full_name,
    email: existingUser.email,
  };

  const token = await reply.jwtSign(jwtPayload);
  reply.setCookie("token", token, {
    path: "/",
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });

  const response: ApiSucessResponseType = {
    status: "success",
    message: "Usuário logado com sucesso",
    meta: {},
    data: [existingUser],
  };

  return reply.status(200).send(response);
};

export const logoutHandler = async (_: FastifyRequest, reply: FastifyReply) => {
  reply.clearCookie("token", { path: "/" });
  const response: ApiSucessResponseType = {
    status: "success",
    message: "Usuário deslogado com sucesso",
    meta: {},
    data: [],
  };
  return reply.status(200).send(response);
};
