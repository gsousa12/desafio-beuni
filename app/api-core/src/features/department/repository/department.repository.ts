import { prisma } from "packages/prisma/dist";
import { DepartmentEntity } from "packages/types/dist";

const db = prisma;

const getByName = async (name: string): Promise<DepartmentEntity | null> => {
  return await db.department.findUnique({
    where: {
      name,
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

export const DepartmentRepository = { getByName, create };
