import {
  createdAtSchema,
  deletedAtSchema,
  updatedAtSchema,
} from "app/api-core/src/_shared/schemas/common.schemas";
import { entitySchemaFromType } from "app/api-core/src/_shared/utils/utils";
import { DepartmentEntity } from "packages/types/dist";
import z from "zod";

export const departmentEntitySchema = entitySchemaFromType<DepartmentEntity>()(
  z.object({
    id: z.string().uuid(),
    user_id: z.string().uuid(),
    name: z.string(),
    description: z.string().optional(),
    created_at: createdAtSchema,
    updated_at: updatedAtSchema,
    deleted_at: deletedAtSchema,
  })
);

export const departmentBaseSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "O campo 'name' deve ter pelo menos 3 caracteres")
    .max(100, "O campo 'name' deve ter no máximo 100 caracteres"),
  description: z
    .string()
    .trim()
    .nullable()
    .optional()
    .refine((val) => val === null || val === undefined || (val.length >= 3 && val.length <= 100), {
      message: "O campo 'description' deve ter entre 3 e 100 caracteres",
    }),
});
