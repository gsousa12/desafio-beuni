import z from "zod";
import { employeeEntitySchema } from "../entity.schema";
import { errorSchema } from "app/api-core/src/_shared/schemas/common.schemas";

export const getAllEmployeeResponse = z.array(
  employeeEntitySchema.omit({
    id: true,
    department_id: true,
    organization_id: true,
    updated_at: true,
    deleted_at: true,
  })
);

export const getAllEmployeeResponseSchema = {
  201: z.object({
    status: z.literal("success"),
    message: z.string(),
    meta: z.any(),
    data: z.array(getAllEmployeeResponse),
  }),
  400: errorSchema,
  500: errorSchema,
} as const;
