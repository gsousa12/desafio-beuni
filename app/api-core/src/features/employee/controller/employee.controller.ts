import { FastifyReply, FastifyRequest } from "fastify";
import { createEmployeeRequestSchemaType } from "../schemas/request/create.request.schema";
import { EmployeeRepository } from "../repository/employee.repository";
import { ApiErrorResponseType, ApiSuccessResponseType } from "packages/types/dist";
import { cpf as cpfValidator } from "cpf-cnpj-validator";
import { DepartmentRepository } from "../../department/repository/department.repository";
import { parseBirthDate } from "app/api-core/src/_shared/utils/utils";
import { getAllEmployeeRequestSchemaType } from "../schemas/request/get-all-employee.request.schema";

export const createEmployeeHandler = async (
  request: FastifyRequest<{ Body: createEmployeeRequestSchemaType }>,
  reply: FastifyReply
) => {
  const organizationId = request.user.organization_id;

  const { name, birth_date, cpf, email, phone, position, department_id } = request.body;
  const isValidCpf = cpfValidator.isValid(cpf);

  if (!isValidCpf) {
    const errorResponse: ApiErrorResponseType = {
      status: "error",
      message: "O campo 'cpf' deve ser um CPF válido",
    };
    return reply.status(400).send(errorResponse);
  }

  const existByCpf = await EmployeeRepository.getByCpf(cpf, organizationId);

  if (existByCpf) {
    const errorResponse: ApiErrorResponseType = {
      status: "error",
      message: "Já existe um colaborador cadastrado com esse cpf",
    };
    return reply.status(400).send(errorResponse);
  }

  const existByEmail = await EmployeeRepository.getByEmail(email, organizationId);
  if (existByEmail) {
    const errorResponse: ApiErrorResponseType = {
      status: "error",
      message: "Já existe um colaborador cadastrado com esse email",
    };
    return reply.status(400).send(errorResponse);
  }

  const existDepartment = await DepartmentRepository.getById(department_id, organizationId);
  if (!existDepartment) {
    const errorResponse: ApiErrorResponseType = {
      status: "error",
      message: "Departamento não encontrado",
    };
    return reply.status(404).send(errorResponse);
  }

  const { birth_date_year, birth_date_month, birth_date_day } = parseBirthDate(birth_date);

  const data = {
    name,
    birth_date,
    birth_date_year,
    birth_date_month,
    birth_date_day,
    cpf,
    email,
    phone,
    position,
    department_id,
    organizationId,
  };

  const createdEmployee = await EmployeeRepository.create(data, organizationId);

  const response: ApiSuccessResponseType = {
    status: "success",
    message: "Colaborador criado com sucesso",
    meta: {},
    data: [createdEmployee],
  };
  return reply.status(201).send(response);
};

export const getAllEmployeeHandler = async (
  request: FastifyRequest<{ Querystring: getAllEmployeeRequestSchemaType }>,
  reply: FastifyReply
) => {
  const organizationId = request.user.organization_id;
  const { page = 1, ...filters } = request.query;

  const result = await EmployeeRepository.getAll(page, filters, organizationId);

  const response: ApiSuccessResponseType = {
    status: "success",
    message: "Colaboradores encontrados com sucesso",
    meta: result.meta,
    data: result.data,
  };

  return reply.status(200).send(response);
};
