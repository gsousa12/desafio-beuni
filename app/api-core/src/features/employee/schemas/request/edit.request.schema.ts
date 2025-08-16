import z from "zod";
import { employeeEntitySchema } from "../entity.schema";
import { birthDateRequestSchema } from "./create.request.schema";

export const editEmployeeRequestBodySchema = z.intersection(
  employeeEntitySchema
    .pick({
      name: true,
      email: true,
      position: true,
      cpf: true,
      phone: true,
      department_id: true,
    })
    .partial(),
  z
    .object({
      birth_date: birthDateRequestSchema,
    })
    .partial()
);

export type editEmployeeRequestBodySchemaType = z.infer<typeof editEmployeeRequestBodySchema>;

export const editEmployeeRequestParamSchema = employeeEntitySchema.pick({
  id: true,
});

export type editEmployeeRequestParamSchemaType = z.infer<typeof editEmployeeRequestParamSchema>;
