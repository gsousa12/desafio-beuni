import { DEFAULT_PAGE_SIZE } from "app/api-core/src/_shared/const/pagination";
import { createPaginationMeta } from "app/api-core/src/_shared/utils/utils";
import { prisma } from "packages/prisma/dist";
import { EmployeeEntity, PaginatedResult } from "packages/types/dist";

const db = prisma;

const getByCpf = async (cpf: string, organization_id: string) => {
  return await db.employee.findFirst({
    where: {
      cpf,
      organization_id,
    },
  });
};

const getByEmail = async (email: string, organization_id: string) => {
  return await db.employee.findFirst({
    where: {
      email,
      organization_id,
    },
  });
};

const create = async (data: any, organization_id: string): Promise<EmployeeEntity> => {
  return await db.employee.create({
    data: {
      name: data.name,
      cpf: data.cpf,
      email: data.email,
      phone: data.phone,
      birth_date: data.birth_date,
      birth_date_month: data.birth_date_month,
      birth_date_day: data.birth_date_day,
      birth_date_year: data.birth_date_year,
      position: data.position,
      department_id: data.department_id,
      organization_id: organization_id,
    },
  });
};

const getAll = async (
  page: number,
  filters: any,
  organization_id: string
): Promise<PaginatedResult<EmployeeEntity>> => {
  const pageSize = DEFAULT_PAGE_SIZE;
  const skip = (page - 1) * pageSize;

  const where: any = { organization_id, deleted_at: null };

  if (filters.name) {
    where.name = { contains: filters.name, mode: "insensitive" };
  }
  if (filters.email) {
    where.email = { contains: filters.email, mode: "insensitive" };
  }
  if (filters.cpf) {
    where.cpf = { contains: filters.cpf };
  }
  if (filters.phone) {
    where.phone = { contains: filters.phone, mode: "insensitive" };
  }
  if (filters.position) {
    where.position = { contains: filters.position, mode: "insensitive" };
  }
  if (filters.birth_date) {
    where.birth_date = filters.birth_date;
  }
  if (filters.department_id) {
    where.department_id = filters.department_id;
  }

  const [data, total] = await Promise.all([
    db.employee.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { created_at: "desc" },
    }),
    db.employee.count({ where }),
  ]);

  const meta = createPaginationMeta(page, pageSize, total);

  return { data, meta };
};

const getById = async (id: string, organization_id: string): Promise<EmployeeEntity | null> => {
  return await db.employee.findFirst({
    where: {
      id,
      organization_id,
      deleted_at: null,
    },
  });
};

const softDelete = async (id: string, organization_id: string): Promise<EmployeeEntity | null> => {
  return await db.employee.update({
    where: {
      id,
      organization_id,
    },
    data: {
      deleted_at: new Date(),
    },
  });
};

const update = async (id: string, data: any, organization_id: string): Promise<EmployeeEntity> => {
  return await db.employee.update({
    where: {
      id,
      organization_id,
    },
    data: {
      name: data.name,
      cpf: data.cpf,
      email: data.email,
      phone: data.phone,
      birth_date: data.birth_date,
      birth_date_month: data.birth_date_month,
      birth_date_day: data.birth_date_day,
      birth_date_year: data.birth_date_year,
      position: data.position,
      department_id: data.department_id,
    },
  });
};

export const EmployeeRepository = {
  getByCpf,
  getByEmail,
  getById,
  getAll,
  create,
  softDelete,
  update,
};
