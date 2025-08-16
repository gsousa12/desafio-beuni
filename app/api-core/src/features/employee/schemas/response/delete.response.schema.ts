import z from "zod";
import { employeeEntitySchema } from "../entity.schema";
import { errorSchema } from "app/api-core/src/_shared/schemas/common.schemas";

export const deleteEmployeeResponse = employeeEntitySchema.pick({
  name: true,
  email: true,
  position: true,
  cpf: true,
});

export const deleteEmployeeResponseSchema = {
  200: z.object({
    status: z.literal("success"),
    message: z.string(),
    meta: z.any(),
    data: z.array(deleteEmployeeResponse),
  }),
  400: errorSchema,
  500: errorSchema,
} as const;
