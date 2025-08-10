import z from "zod";
import { createDepartmentRequestSchema } from "./department.body.schema";
import { errorSchema } from "app/api-core/src/_shared/schemas/common.schemas";
import { departmentEntitySchema } from "./department.base.schema";

const createDepartmentResponse = departmentEntitySchema.omit({
  id: true,
  user_id: true,
  deleted_at: true,
  updated_at: true,
});

export const createDepartmentResponseSchema = {
  201: z.object({
    status: z.literal("success"),
    message: z.string(),
    meta: z.any(),
    data: z.array(createDepartmentRequestSchema),
  }),
  400: errorSchema,
  500: errorSchema,
} as const;
