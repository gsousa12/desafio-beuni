import z from "zod";
import { employeeEntitySchema } from "../entity.schema";
import { errorSchema } from "app/api-core/src/_shared/schemas/common.schemas";

export const getAllEmployeeResponse = employeeEntitySchema;

export const getAllEmployeeResponseSchema = {
  200: z.object({
    status: z.literal("success"),
    message: z.string(),
    meta: z.any(),
    data: z.array(getAllEmployeeResponse),
  }),
  400: errorSchema,
  500: errorSchema,
} as const;
