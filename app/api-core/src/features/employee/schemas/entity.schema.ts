import {
  birthDateSchema,
  cpfSchema,
  createdAtSchema,
  deletedAtSchema,
  emailSchema,
  idSchema,
  nameSchema,
  phoneSchema,
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
    position: z.string().trim().max(100, "O campo 'position' deve ter no máximo 100 caracteres"),
    birth_date: birthDateSchema,
    created_at: createdAtSchema,
    updated_at: updatedAtSchema,
    deleted_at: deletedAtSchema,
  })
);
