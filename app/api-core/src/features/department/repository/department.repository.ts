import { DEFAULT_PAGE_SIZE } from "app/api-core/src/_shared/const/pagination";
import { createPaginationMeta } from "app/api-core/src/_shared/utils/utils";
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

const getAll = async (page: number, organizationId: string) => {
  const pageSize = DEFAULT_PAGE_SIZE;
  const skip = (page - 1) * pageSize;

  const where: any = { organization_id: organizationId, deleted_at: null };

  const [data, total] = await Promise.all([
    db.department.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { created_at: "desc" },
    }),
    db.department.count({ where }),
  ]);

  const meta = createPaginationMeta(page, pageSize, total);

  return { data, meta };
};

export const DepartmentRepository = { getByName, create, getById, getAll };
