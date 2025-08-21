import { FastifyReply, FastifyRequest } from "fastify";
import { DepartmentRepository } from "../repository/department.repository";
import { ApiErrorResponseType, ApiSuccessResponseType } from "packages/types/dist";
import { CreateDepartmentRequestSchemaType } from "../schemas/request/create.request.schema";
import { getAllDepartmentRequestSchemaType } from "../schemas/request/get-all.request.schema";
import { DEFAULT_PAGE } from "app/api-core/src/_shared/const/pagination";

export const createDepartmentHandler = async (
  request: FastifyRequest<{ Body: CreateDepartmentRequestSchemaType }>,
  reply: FastifyReply
) => {
  const organizationId = request.user.organization_id;
  const { name, description } = request.body;
  const department = await DepartmentRepository.getByName(name, organizationId);
  if (department) {
    const errorResponse: ApiErrorResponseType = {
      status: "error",
      message: "Já existe um departamento cadastrado com esse nome",
    };
    return reply.status(400).send(errorResponse);
  }

  const data = { name, description, organizationId };

  const createdDepartment = await DepartmentRepository.create(organizationId, data);

  const response: ApiSuccessResponseType = {
    status: "success",
    message: "Departamento criado com sucesso",
    meta: {},
    data: [createdDepartment],
  };
  return reply.status(201).send(response);
};

export const getAllDepartmentHandler = async (
  request: FastifyRequest<{ Querystring: getAllDepartmentRequestSchemaType }>,
  reply: FastifyReply
) => {
  const organizationId = request.user.organization_id;
  const { page = DEFAULT_PAGE } = request.query;

  const result = await DepartmentRepository.getAll(page, organizationId);

  const response: ApiSuccessResponseType = {
    status: "success",
    message: "Departamentos encontrados com sucesso",
    meta: result.meta,
    data: result.data,
  };

  return reply.status(200).send(response);
};
