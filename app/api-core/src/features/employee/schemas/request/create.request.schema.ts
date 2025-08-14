import z from "zod";
import { employeeEntitySchema } from "../entity.schema";
import {
  cpfSchema,
  emailSchema,
  idSchema,
  nameSchema,
  phoneSchema,
} from "app/api-core/src/_shared/schemas/common.schemas";

export const birthDateRequestSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, {
    message: "O campo 'birth_date' deve estar no formato YYYY-MM-DD",
  })
  .transform((str) => {
    const date = new Date(str);
    date.setHours(0, 0, 0, 0);
    return date;
  })
  .refine((date) => date <= new Date(), {
    message: "O campo 'birth_date' deve ser uma data válida no passado ou presente",
  });

export const createEmployeeRequestSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  cpf: cpfSchema,
  phone: phoneSchema,
  position: z.string().trim().max(100, "O campo 'position' deve ter no máximo 100 caracteres"),
  birth_date: birthDateRequestSchema,
  department_id: idSchema,
});

export type createEmployeeRequestSchemaType = z.infer<typeof createEmployeeRequestSchema>;
