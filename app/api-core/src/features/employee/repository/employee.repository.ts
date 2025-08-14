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
      position: data.position,
      department_id: data.department_id,
      organization_id: organization_id,
    },
  });
};

export const EmployeeRepository = { getByCpf, getByEmail, create };
