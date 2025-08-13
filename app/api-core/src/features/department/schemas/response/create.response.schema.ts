import z from "zod";
import { departmentEntitySchema } from "../entity.schema";
import { errorSchema } from "app/api-core/src/_shared/schemas/common.schemas";

const createDepartmentResponse = departmentEntitySchema.omit({
  id: true,
  organization_id: true,
  deleted_at: true,
  updated_at: true,
});

export const createDepartmentResponseSchema = {
  201: z.object({
    status: z.literal("success"),
    message: z.string(),
    meta: z.any(),
    data: z.array(createDepartmentResponse),
  }),
  400: errorSchema,
  500: errorSchema,
} as const;
