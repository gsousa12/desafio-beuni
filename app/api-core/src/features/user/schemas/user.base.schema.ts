import { z } from "zod";
import { emailSchema, fullNameSchema } from "app/api-core/src/_shared/schemas/common.schemas";
import { entitySchemaFromType } from "app/api-core/src/_shared/utils/a";
import { UserEntity } from "packages/types/dist";

export const userEntitySchema = entitySchemaFromType<UserEntity>()(
  z.object({
    id: z.string().uuid(),
    full_name: z.string(),
    email: z.string().email(),
    hash_password: z.string(),
    created_at: z.coerce.date(),
    updated_at: z.coerce.date().nullable().optional(),
  })
);
export const userBaseSchema = z.object({
  full_name: fullNameSchema,
  email: emailSchema,
});
