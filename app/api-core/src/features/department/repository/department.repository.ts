import { prisma } from "packages/prisma/dist";
import { DepartmentEntity } from "packages/types/dist";

const db = prisma;

const getByName = async (
  name: string,
  organization_id: string
): Promise<DepartmentEntity | null> => {
  return await db.department.findUnique({
    where: {
      name,
      organization_id,
    },
  });
};

const getById = async (id: string, organizationId: string): Promise<DepartmentEntity | null> => {
  return await db.department.findFirst({
    where: {
      id,
      organization_id: organizationId,
    },
  });
};

const create = async (organizationId: string, data: any): Promise<DepartmentEntity> => {
  return await db.department.create({
    data: {
      name: data.name,
      description: data.description,
      organization_id: organizationId,
    },
  });
};

export const DepartmentRepository = { getByName, create, getById };
