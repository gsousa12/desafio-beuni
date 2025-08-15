import { FastifyReply, FastifyRequest } from "fastify";
import { cnpj as cnpjValidator } from "cpf-cnpj-validator";
import { ApiErrorResponseType, ApiSuccessResponseType } from "packages/types/dist";
import { OrganizationRepository } from "../repository/organization.repository";
import { CreateOrganizationRequestSchemaType } from "../schemas/request/create.request.schema";
import { CreateAddressRequestSchemaType } from "../schemas/request/create-address.request.schema";

export const createOrganizationHandler = async (
  request: FastifyRequest<{ Body: CreateOrganizationRequestSchemaType }>,
  reply: FastifyReply
) => {
  const { name, cnpj } = request.body;

  const isValidCnpj = cnpjValidator.isValid(cnpj);
  if (!isValidCnpj) {
    const errorResponse: ApiErrorResponseType = {
      status: "error",
      message: "O campo 'cnpj' é inválido. Por favor, verifique o número informado.",
    };
    return reply.status(400).send(errorResponse);
  }

  const organization = await OrganizationRepository.getByName(name);
  if (organization) {
    const errorResponse: ApiErrorResponseType = {
      status: "error",
      message: "Já existe uma organização cadastrada com esse nome",
    };
    return reply.status(400).send(errorResponse);
  }

  const organizationByCnpj = await OrganizationRepository.getByCnpj(cnpj);
  if (organizationByCnpj) {
    const errorResponse: ApiErrorResponseType = {
      status: "error",
      message: "Já existe uma organização cadastrada com esse CNPJ",
    };
    return reply.status(400).send(errorResponse);
  }

  const data = { name, cnpj };

  const createdOrganization = await OrganizationRepository.create(data);

  const response: ApiSuccessResponseType = {
    status: "success",
    message: "Organização criada com sucesso",
    meta: {},
    data: [createdOrganization],
  };

  return reply.status(201).send(response);
};

export const createAddressHandler = async (
  request: FastifyRequest<{ Body: CreateAddressRequestSchemaType }>,
  reply: FastifyReply
) => {
  const { state, city, neighborhood, street, zip_code, number, organization_id } = request.body;
  const organization = await OrganizationRepository.getById(organization_id);

  if (!organization) {
    const errorResponse: ApiErrorResponseType = {
      status: "error",
      message: "Organização não encontrada",
    };
    return reply.status(404).send(errorResponse);
  }

  const existingAddress = await OrganizationRepository.getAddressByOrganizationId(organization_id);

  if (existingAddress) {
    const errorResponse: ApiErrorResponseType = {
      status: "error",
      message: "A organização já possui um endereço cadastrado",
    };
    return reply.status(400).send(errorResponse);
  }

  const data = { state, city, neighborhood, street, zip_code, number };

  const createdAddress = await OrganizationRepository.createAddress(organization_id, data);

  const response: ApiSuccessResponseType = {
    status: "success",
    message: "Endereço criado com sucesso",
    meta: {},
    data: [createdAddress],
  };
  return reply.status(201).send(response);
};
