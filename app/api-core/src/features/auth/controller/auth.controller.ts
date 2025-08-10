import { FastifyReply, FastifyRequest } from "fastify";
import { loginRequestSchemaType } from "../schemas/auth.body.schema";
import { UserRepository } from "../../user/repository/user.repository";
import { ApiErrorResponseType, ApiSucessResponseType, JwtPayloadType } from "packages/types/dist";
import { mathPassword } from "app/api-core/src/_shared/utils/utils";

export const loginHandler = async (
  request: FastifyRequest<{ Body: loginRequestSchemaType }>,
  reply: FastifyReply
) => {
  const { email, password } = request.body;
  try {
    const existingUser = await UserRepository.getByEmail(email);
    if (!existingUser) {
      const errorResponse: ApiErrorResponseType = {
        status: "error",
        message: "Nenhum usuário encontrado com esse email",
      };
      return reply.status(400).send(errorResponse);
    }

    const math = await mathPassword(password, existingUser.hash_password);
    if (!math) {
      const errorResponse: ApiErrorResponseType = {
        status: "error",
        message: "Credenciais inválidas",
      };
      return reply.status(400).send(errorResponse);
    }

    const jwtPayload: JwtPayloadType = {
      id: existingUser.id,
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
  } catch (error) {
  } finally {
  }
};

export const logoutHandler = async (_: FastifyRequest, reply: FastifyReply) => {
  reply.clearCookie("token", { path: "/" });
  return reply.status(200).send({ data: {} });
};
