import {
  birthDateSchema,
  cpfSchema,
  createdAtSchema,
  deletedAtSchema,
  emailSchema,
  idSchema,
  nameSchema,
  phoneSchema,
  positionSchema,
  updatedAtSchema,
} from "app/api-core/src/_shared/schemas/common.schemas";
import { entitySchemaFromType } from "app/api-core/src/_shared/utils/utils";
import { EmployeeEntity } from "packages/types/dist";
import z from "zod";

export const employeeEntitySchema = entitySchemaFromType<EmployeeEntity>()(
  z.object({
    id: idSchema,
    department_id: idSchema,
    organization_id: idSchema,
    name: nameSchema,
    email: emailSchema,
    cpf: cpfSchema,
    phone: phoneSchema,
    position: positionSchema,
    birth_date: birthDateSchema,
    birth_date_month: z.string(),
    birth_date_day: z.string(),
    birth_date_year: z.string(),
    created_at: createdAtSchema,
    updated_at: updatedAtSchema,
    deleted_at: deletedAtSchema,
  })
);
