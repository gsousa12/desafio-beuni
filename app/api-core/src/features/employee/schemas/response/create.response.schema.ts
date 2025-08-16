import z from "zod";
import { employeeEntitySchema } from "../entity.schema";
import { errorSchema } from "app/api-core/src/_shared/schemas/common.schemas";

export const createEmployeeResponse = employeeEntitySchema.omit({
  id: true,
  department_id: true,
  organization_id: true,
  birth_date_day: true,
  birth_date_month: true,
  birth_date_year: true,
  updated_at: true,
  deleted_at: true,
});

export const createEmployeeResponseSchema = {
  201: z.object({
    status: z.literal("success"),
    message: z.string(),
    meta: z.any(),
    data: z.array(createEmployeeResponse),
  }),
  400: errorSchema,
  500: errorSchema,
} as const;
