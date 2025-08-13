import { FastifyReply, FastifyRequest } from "fastify";
import { DepartmentRepository } from "../repository/department.repository";
import { ApiErrorResponseType, ApiSucessResponseType } from "packages/types/dist";
import { CreateDepartmentRequestSchemaType } from "../schemas/request/create.request.schema";

export const createDepartmentHandler = async (
  request: FastifyRequest<{ Body: CreateDepartmentRequestSchemaType }>,
  reply: FastifyReply
) => {
  const organizationId = request.user.organization_id;
  console.log("Organization ID:", organizationId);
  const { name, description } = request.body;
  const department = await DepartmentRepository.getByName(name);
  if (department) {
    const errorResponse: ApiErrorResponseType = {
      status: "error",
      message: "Já existe um departamento cadastrado com esse nome",
    };
    return reply.status(400).send(errorResponse);
  }

  const data = { name, description, organizationId };

  const createdDepartment = await DepartmentRepository.create(organizationId, data);

  const response: ApiSucessResponseType = {
    status: "success",
    message: "Departamento criado com sucesso",
    meta: {},
    data: [createdDepartment],
  };
  return reply.status(201).send(response);
};
