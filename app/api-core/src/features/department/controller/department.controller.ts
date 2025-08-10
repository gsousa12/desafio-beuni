import { FastifyReply, FastifyRequest } from "fastify";
import { CreateDepartmentRequestSchemaType } from "../schemas/department.body.schema";
import { DepartmentRepository } from "../repository/department.repository";
import { ApiErrorResponseType, ApiSucessResponseType } from "packages/types/dist";

export const createDepartmentHandler = async (
  request: FastifyRequest<{ Body: CreateDepartmentRequestSchemaType }>,
  reply: FastifyReply
) => {
  const userId = request.user.id;
  const { name, description } = request.body;
  try {
    const department = await DepartmentRepository.getByName(name);
    if (department) {
      const errorResponse: ApiErrorResponseType = {
        status: "error",
        message: "Já existe um departamento cadastrado com esse nome",
      };
      return reply.status(400).send(errorResponse);
    }

    const data = { name, description, userId };

    const createdDepartment = await DepartmentRepository.create(userId, data);

    const response: ApiSucessResponseType = {
      status: "success",
      message: "Departamento criado com sucesso",
      meta: {},
      data: [createdDepartment],
    };
    return reply.status(201).send(response);
  } catch (error) {
  } finally {
  }
};
