import { FastifyReply, FastifyRequest } from "fastify";
import { createEmployeeRequestSchemaType } from "../schemas/request/create.request.schema";
import { EmployeeRepository } from "../repository/employee.repository";
import { ApiErrorResponseType, ApiSuccessResponseType } from "packages/types/dist";
import { cpf as cpfValidator } from "cpf-cnpj-validator";
import { DepartmentRepository } from "../../department/repository/department.repository";
import { parseBirthDate } from "app/api-core/src/_shared/utils/utils";
import { getAllEmployeeRequestSchemaType } from "../schemas/request/get-all.request.schema";
import { getEmployeeRequestSchemaType } from "../schemas/request/get-by-id.request.schema";
import { deleteEmployeeRequestSchemaType } from "../schemas/request/delete.request.schema";
import {
  editEmployeeRequestBodySchemaType,
  editEmployeeRequestParamSchemaType,
} from "../schemas/request/edit.request.schema";

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

export const getEmployeeHandler = async (
  request: FastifyRequest<{ Params: getEmployeeRequestSchemaType }>,
  reply: FastifyReply
) => {
  const { id } = request.params;
  const organizationId = request.user.organization_id;
  const employee = await EmployeeRepository.getById(id, organizationId);
  if (!employee) {
    const errorResponse: ApiErrorResponseType = {
      status: "error",
      message: "Colaborador não encontrado",
    };
    return reply.status(404).send(errorResponse);
  }
  const response: ApiSuccessResponseType = {
    status: "success",
    message: "Colaborador encontrado com sucesso",
    meta: {},
    data: [employee],
  };
  return reply.status(200).send(response);
};

export const deleteEmployeeHandler = async (
  request: FastifyRequest<{ Params: deleteEmployeeRequestSchemaType }>,
  reply: FastifyReply
) => {
  const { id } = request.params;
  const organizationId = request.user.organization_id;

  const employee = await EmployeeRepository.getById(id, organizationId);
  if (!employee) {
    const errorResponse: ApiErrorResponseType = {
      status: "error",
      message: "Colaborador não encontrado",
    };
    return reply.status(404).send(errorResponse);
  }
  await EmployeeRepository.softDelete(id, organizationId);
  const response: ApiSuccessResponseType = {
    status: "success",
    message: "Colaborador deletado com sucesso",
    meta: {},
    data: [employee],
  };
  return reply.status(200).send(response);
};

export const editEmployeeHandler = async (
  request: FastifyRequest<{
    Body: editEmployeeRequestBodySchemaType;
    Params: editEmployeeRequestParamSchemaType;
  }>,
  reply: FastifyReply
) => {
  const { id } = request.params;
  const { ...updateData } = request.body;
  const organizationId = request.user.organization_id;
  const employee = await EmployeeRepository.getById(id, organizationId);
  if (!employee) {
    const errorResponse: ApiErrorResponseType = {
      status: "error",
      message: "Colaborador não encontrado",
    };
    return reply.status(404).send(errorResponse);
  }
  if (updateData.cpf) {
    const isValidCpf = cpfValidator.isValid(updateData.cpf);
    if (!isValidCpf) {
      const errorResponse: ApiErrorResponseType = {
        status: "error",
        message: "O campo 'cpf' deve ser um CPF válido",
      };
      return reply.status(400).send(errorResponse);
    }

    const existByCpf = await EmployeeRepository.getByCpf(updateData.cpf, organizationId);
    if (existByCpf && existByCpf.id !== id) {
      const errorResponse: ApiErrorResponseType = {
        status: "error",
        message: "Já existe um colaborador cadastrado com esse cpf",
      };
      return reply.status(400).send(errorResponse);
    }
  }
  if (updateData.email) {
    const existByEmail = await EmployeeRepository.getByEmail(updateData.email, organizationId);
    if (existByEmail && existByEmail.id !== id) {
      const errorResponse: ApiErrorResponseType = {
        status: "error",
        message: "Já existe um colaborador cadastrado com esse email",
      };
      return reply.status(400).send(errorResponse);
    }
  }

  const data = {
    ...updateData,
    ...(updateData.birth_date && parseBirthDate(updateData.birth_date)),
  };

  const updatedEmployee = await EmployeeRepository.update(id, data, organizationId);
  const response: ApiSuccessResponseType = {
    status: "success",
    message: "Colaborador atualizado com sucesso",
    meta: {},
    data: [updatedEmployee],
  };
  return reply.status(200).send(response);
};
