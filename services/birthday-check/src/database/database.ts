import { prisma } from "packages/prisma/dist";
import { BirthdayEmployee } from "packages/types/dist";
import logger from "../logger";

const db = prisma;

const getUpcomingBirthdays = async (page = 0, limit = 100): Promise<BirthdayEmployee[]> => {
  const today = new Date();
  const sevenDaysFromNow = new Date(today);
  sevenDaysFromNow.setDate(today.getDate() + 7);

  logger.info(
    `[database] searching birthdays from ${today.toISOString().split("T")[0]} to ${sevenDaysFromNow.toISOString().split("T")[0]}`
  );

  // Extrair dia e mês para comparação com zero padding
  const startMonth = (today.getMonth() + 1).toString().padStart(2, "0");
  const startDay = today.getDate().toString().padStart(2, "0");
  const endMonth = (sevenDaysFromNow.getMonth() + 1).toString().padStart(2, "0");
  const endDay = sevenDaysFromNow.getDate().toString().padStart(2, "0");

  logger.info(
    `[database] searching month/day range: ${startMonth}/${startDay} to ${endMonth}/${endDay}`
  );

  // Query base para employees não deletados
  const baseWhere = {
    deleted_at: null,
    birth_date_month: {
      not: null,
    },
    birth_date_day: {
      not: null,
    },
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

  // Se não há virada de ano (ex: 14/08 a 21/08)
  if (startMonth === endMonth) {
    birthdayWhere = {
      ...baseWhere,
      birth_date_month: startMonth,
      birth_date_day: {
        gte: startDay,
        lte: endDay,
      },
    };
  }
  // Se há virada de ano (ex: 29/12 a 05/01)
  else {
    birthdayWhere = {
      ...baseWhere,
      OR: [
        // Dias restantes do ano atual
        {
          birth_date_month: startMonth,
          birth_date_day: {
            gte: startDay,
          },
        },
        // Dias do próximo ano
        {
          birth_date_month: endMonth,
          birth_date_day: {
            lte: endDay,
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
            take: 1,
          },
        },
      },
    },
    skip: page * limit,
    take: limit,
    orderBy: [
      {
        birth_date_month: "asc",
      },
      {
        birth_date_day: "asc",
      },
    ],
  });

  logger.info(`[database] found ${employees.length} employees with upcoming birthdays`);

  // Transformar para o formato BirthdayEmployee
  return employees
    .filter((emp) => emp.organization.address.length > 0) // Garantir que tem endereço
    .map((emp) => {
      const birthDate = emp.birth_date as Date;
      return {
        employee: {
          id: emp.id,
          name: emp.name,
          email: emp.email,
          position: emp.position,
          birth_date_day: emp.birth_date_day,
          birth_date_month: emp.birth_date_month,
          birth_date_year: emp.birth_date_year,
          birth_date: birthDate ? birthDate.toISOString().split("T")[0] : undefined,
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

  const startMonth = (today.getMonth() + 1).toString().padStart(2, "0");
  const startDay = today.getDate().toString().padStart(2, "0");
  const endMonth = (sevenDaysFromNow.getMonth() + 1).toString().padStart(2, "0");
  const endDay = sevenDaysFromNow.getDate().toString().padStart(2, "0");

  logger.info(
    `[database] counting birthdays for range: ${startMonth}/${startDay} to ${endMonth}/${endDay}`
  );

  const baseWhere = {
    deleted_at: null,
    birth_date_month: {
      not: null,
    },
    birth_date_day: {
      not: null,
    },
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
      birth_date_month: startMonth,
      birth_date_day: {
        gte: startDay,
        lte: endDay,
      },
    };
  } else {
    birthdayWhere = {
      ...baseWhere,
      OR: [
        {
          birth_date_month: startMonth,
          birth_date_day: {
            gte: startDay,
          },
        },
        {
          birth_date_month: endMonth,
          birth_date_day: {
            lte: endDay,
          },
        },
      ],
    };
  }

  const count = await db.employee.count({
    where: birthdayWhere,
  });

  logger.info(`[database] found ${count} employees with upcoming birthdays`);
  return count;
};

export const DatabaseService = {
  getUpcomingBirthdays,
  countUpcomingBirthdays,
};
