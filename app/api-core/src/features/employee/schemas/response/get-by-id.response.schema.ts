import z from "zod";
import { employeeEntitySchema } from "../entity.schema";
import { errorSchema } from "app/api-core/src/_shared/schemas/common.schemas";

export const getEmployeeResponse = employeeEntitySchema;

export const getEmployeeResponseSchema = {
  200: z.object({
    status: z.literal("success"),
    message: z.string(),
    meta: z.any(),
    data: z.array(getEmployeeResponse),
  }),
  400: errorSchema,
  500: errorSchema,
} as const;
