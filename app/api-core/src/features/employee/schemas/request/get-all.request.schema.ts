import z from "zod";
import { employeeEntitySchema } from "../entity.schema";
import { paginationSchema } from "app/api-core/src/_shared/schemas/common.schemas";

const getAllEmployeeFilterSchema = employeeEntitySchema
  .pick({
    name: true,
    email: true,
    cpf: true,
    phone: true,
    position: true,
    birth_date: true,
    department_id: true,
  })
  .partial();

export const getAllEmployeeRequestSchema = z.intersection(
  paginationSchema,
  getAllEmployeeFilterSchema
);

export type getAllEmployeeRequestSchemaType = z.infer<typeof getAllEmployeeRequestSchema>;
