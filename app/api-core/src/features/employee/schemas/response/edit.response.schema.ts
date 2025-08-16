import z from "zod";
import { employeeEntitySchema } from "../entity.schema";
import { errorSchema } from "app/api-core/src/_shared/schemas/common.schemas";

export const editEmployeeResponse = employeeEntitySchema.omit({
  id: true,
  organization_id: true,
  department_id: true,
  created_at: true,
  deleted_at: true,
  birth_date_day: true,
  birth_date_month: true,
  birth_date_year: true,
});

export const editEmployeeResponseSchema = {
  200: z.object({
    status: z.literal("success"),
    message: z.string(),
    meta: z.any(),
    data: z.array(editEmployeeResponse),
  }),
  400: errorSchema,
  500: errorSchema,
} as const;
