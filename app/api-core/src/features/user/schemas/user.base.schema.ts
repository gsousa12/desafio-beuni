import { z } from "zod";
import {
  createdAtSchema,
  emailSchema,
  fullNameSchema,
  updatedAtSchema,
} from "app/api-core/src/_shared/schemas/common.schemas";
import { entitySchemaFromType } from "app/api-core/src/_shared/utils/utils";
import { OrganizationAddressEntity, UserEntity } from "packages/types/dist";

export const userEntitySchema = entitySchemaFromType<UserEntity>()(
  z.object({
    id: z.string().uuid(),
    organization_id: z.string().uuid(),
    full_name: z.string(),
    email: z.string().email(),
    hash_password: z.string(),
    created_at: createdAtSchema,
    updated_at: updatedAtSchema,
  })
);

export const organizationAddressEntitySchema = entitySchemaFromType<OrganizationAddressEntity>()(
  z.object({
    id: z.string().uuid(),
    organization_id: z.string().uuid(),
    state: z.string(),
    city: z.string(),
    neighborhood: z.string(),
    street: z.string(),
    zip_code: z.string(),
    number: z.string(),
    created_at: createdAtSchema,
    updated_at: updatedAtSchema,
  })
);

export const userBaseSchema = z.object({
  organization_id: z.string().uuid(),
  full_name: fullNameSchema,
  email: emailSchema,
});
