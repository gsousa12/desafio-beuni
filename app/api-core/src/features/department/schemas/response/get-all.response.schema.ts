import z from "zod";
import { departmentEntitySchema } from "../entity.schema";
import { errorSchema } from "app/api-core/src/_shared/schemas/common.schemas";

export const getAllDepartmentResponse = departmentEntitySchema;

export const getAllDepartmentResponseSchema = {
  200: z.object({
    status: z.literal("success"),
    message: z.string(),
    meta: z.any(),
    data: z.array(getAllDepartmentResponse),
  }),
  400: errorSchema,
  500: errorSchema,
} as const;
