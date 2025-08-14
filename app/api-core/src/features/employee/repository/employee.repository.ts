import { prisma } from "packages/prisma/dist";

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

const create = async (data: any, organization_id: string) => {
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

export const EmployeeRepository = { getByCpf, getByEmail, create };
