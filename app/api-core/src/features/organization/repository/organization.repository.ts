import { prisma } from "packages/prisma/dist";
import { OrganizationAddressEntity } from "packages/types/dist";

const db = prisma;

const getByName = async (legal_name: string) => {
  return db.organization.findFirst({
    where: {
      legal_name,
    },
  });
};

const getByCnpj = async (cnpj: string) => {
  return db.organization.findFirst({
    where: {
      cnpj,
    },
  });
};

const create = async (data: any) => {
  return db.organization.create({
    data: {
      legal_name: data.legal_name,
      trading_name: data.trading_name,
      cnpj: data.cnpj,
    },
  });
};

const getById = async (id: string) => {
  return db.organization.findUnique({
    where: {
      id,
    },
  });
};

const createAddress = async (
  organizationId: string,
  addressData: any
): Promise<OrganizationAddressEntity> => {
  return await db.organizationAddress.create({
    data: {
      organization_id: organizationId,
      state: addressData.state,
      city: addressData.city,
      neighborhood: addressData.neighborhood,
      street: addressData.street,
      zip_code: addressData.zip_code,
      number: addressData.number,
    },
  });
};

const getAddressByOrganizationId = async (
  organizationId: string
): Promise<OrganizationAddressEntity | null> => {
  return await db.organizationAddress.findFirst({
    where: {
      organization_id: organizationId,
    },
  });
};

export const OrganizationRepository = {
  getByName,
  getByCnpj,
  create,
  getById,
  createAddress,
  getAddressByOrganizationId,
};
