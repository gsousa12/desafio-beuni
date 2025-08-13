import { entitySchemaFromType } from "app/api-core/src/_shared/utils/utils";
import { EmployeeEntity } from "packages/types/dist";
import z from "zod";

export const departmentEntitySchema = entitySchemaFromType<EmployeeEntity>()(
  z.object({
    id: z.string().uuid(),
    user_id: z.string().uuid(),
    department_id: z.string().uuid(),
    name: z.string(),
    email: z.string().email(),
    tax_id: z.string(),
    phone: z.string(),
    position: z.string(),
    birth_date: z.date(),
    created_at: z.date(),
    updated_at: z.date(),
    deleted_at: z.date().nullable().optional(),
  })
);

export const employeeBaseSchema = z.object({
  name: z
    .string()
    .trim()
    .min(5, "O campo 'name' deve ter pelo menos 5 caracteres")
    .max(200, "O campo 'name' deve ter no máximo 200 caracteres"),
});
