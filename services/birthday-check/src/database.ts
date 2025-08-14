import { prisma } from "packages/prisma/dist";
import { BirthdayEmployee } from "packages/types/dist";

const db = prisma;

const getUpcomingBirthdays = async (page = 0, limit = 100): Promise<BirthdayEmployee[]> => {
  const today = new Date();
  const sevenDaysFromNow = new Date(today);
  sevenDaysFromNow.setDate(today.getDate() + 7);
  console.log(
    `Fetching upcoming birthdays from ${today.toISOString()} to ${sevenDaysFromNow.toISOString()}`
  );

  // Extrair dia e mês para comparação
  const startMonth = today.getMonth() + 1; // getMonth() retorna 0-11
  const startDay = today.getDate();
  const endMonth = sevenDaysFromNow.getMonth() + 1;
  const endDay = sevenDaysFromNow.getDate();

  // Query base para employees não deletados
  const baseWhere = {
    deleted_at: null,
    department: {
      deleted_at: null,
    },
  };

  let birthdayWhere: any;

  // Se não há virada de ano (ex: 15/03 a 22/03)
  if (startMonth === endMonth) {
    birthdayWhere = {
      ...baseWhere,
      AND: [
        {
          birth_date: {
            gte: new Date(today.getFullYear(), startMonth - 1, startDay),
            lte: new Date(today.getFullYear(), endMonth - 1, endDay),
          },
        },
      ],
    };
  }
  // Se há virada de ano (ex: 29/12 a 05/01)
  else {
    birthdayWhere = {
      ...baseWhere,
      OR: [
        // Dias restantes do ano atual
        {
          birth_date: {
            gte: new Date(today.getFullYear(), startMonth - 1, startDay),
            lte: new Date(today.getFullYear(), 11, 31), // 31 de dezembro
          },
        },
        // Dias do próximo ano
        {
          birth_date: {
            gte: new Date(today.getFullYear(), 0, 1), // 1 de janeiro
            lte: new Date(today.getFullYear(), endMonth - 1, endDay),
          },
        },
      ],
    };
  }

  const employees = await db.employee.findMany({
    where: birthdayWhere,
    include: {
      organization: {
        include: {
          address: {
            where: {
              deleted_at: null,
            },
            take: 1, // Apenas um endereço por organização
          },
        },
      },
    },
    skip: page * limit,
    take: limit,
    orderBy: {
      birth_date: "asc",
    },
  });

  console.log(employees);

  // Transformar para o formato BirthdayEmployee
  return employees
    .filter((emp) => emp.organization.address.length > 0 && emp.birth_date) // Garantir que tem endereço e birth_date
    .map((emp) => {
      const birthDate = emp.birth_date as Date; // Type assertion após filter
      return {
        employee: {
          id: emp.id,
          name: emp.name,
          email: emp.email,
          birth_date: birthDate.toISOString().split("T")[0], // Formato YYYY-MM-DD
          position: emp.position,
        },
        organization: {
          id: emp.organization.id,
          name: emp.organization.name,
          address: {
            state: emp.organization.address[0]!.state,
            city: emp.organization.address[0]!.city,
            neighborhood: emp.organization.address[0]!.neighborhood,
            street: emp.organization.address[0]!.street,
            zip_code: emp.organization.address[0]!.zip_code,
            number: emp.organization.address[0]!.number,
          },
        },
      };
    });
};

const countUpcomingBirthdays = async (): Promise<number> => {
  const today = new Date();
  const sevenDaysFromNow = new Date(today);
  sevenDaysFromNow.setDate(today.getDate() + 7);

  const startMonth = today.getMonth() + 1;
  const startDay = today.getDate();
  const endMonth = sevenDaysFromNow.getMonth() + 1;
  const endDay = sevenDaysFromNow.getDate();

  const baseWhere = {
    deleted_at: null,
    organization: {
      address: {
        some: {
          deleted_at: null,
        },
      },
    },
    department: {
      deleted_at: null,
    },
  };

  let birthdayWhere: any;

  if (startMonth === endMonth) {
    birthdayWhere = {
      ...baseWhere,
      AND: [
        {
          birth_date: {
            gte: new Date(today.getFullYear(), startMonth - 1, startDay),
            lte: new Date(today.getFullYear(), endMonth - 1, endDay),
          },
        },
      ],
    };
  } else {
    birthdayWhere = {
      ...baseWhere,
      OR: [
        {
          birth_date: {
            gte: new Date(today.getFullYear(), startMonth - 1, startDay),
            lte: new Date(today.getFullYear(), 11, 31),
          },
        },
        {
          birth_date: {
            gte: new Date(today.getFullYear(), 0, 1),
            lte: new Date(today.getFullYear(), endMonth - 1, endDay),
          },
        },
      ],
    };
  }

  return await db.employee.count({
    where: birthdayWhere,
  });
};

export const DatabaseService = {
  getUpcomingBirthdays,
  countUpcomingBirthdays,
};
