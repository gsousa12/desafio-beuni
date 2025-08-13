import {
  createdAtSchema,
  emailSchema,
  fullNameSchema,
  idSchema,
  updatedAtSchema,
} from "app/api-core/src/_shared/schemas/common.schemas";
import { entitySchemaFromType } from "app/api-core/src/_shared/utils/utils";
import { UserEntity } from "packages/types/dist";
import z from "zod";

export const userEntitySchema = entitySchemaFromType<UserEntity>()(
  z.object({
    id: idSchema,
    organization_id: idSchema,
    full_name: fullNameSchema,
    email: emailSchema,
    hash_password: z.string(),
    created_at: createdAtSchema,
    updated_at: updatedAtSchema,
  })
);
