import { z } from "zod";
import { emailSchema, fullNameSchema } from "app/api-core/src/_shared/schemas/common.schemas";
import { entitySchemaFromType } from "app/api-core/src/_shared/utils/utils";
import { UserAddressEntity, UserEntity } from "packages/types/dist";
import { id } from "zod/v4/locales";

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

export const userAddressEntitySchema = entitySchemaFromType<UserAddressEntity>()(
  z.object({
    id: z.string().uuid(),
    user_id: z.string().uuid(),
    state: z.string(),
    city: z.string(),
    neighborhood: z.string(),
    street: z.string(),
    zip_code: z.string(),
    number: z.string(),
    created_at: z.coerce.date(),
    updated_at: z.coerce.date().nullable().optional(),
  })
);

export const userBaseSchema = z.object({
  full_name: fullNameSchema,
  email: emailSchema,
});

export const addressBaseSchema = z.object({
  state: z.string().trim().length(2, "O campo 'state' deve ter exatamente 2 caracteres"),
  city: z
    .string()
    .trim()
    .min(3, "O campo 'city' deve ter pelo menos 3 caracteres")
    .max(100, "O campo 'city' deve ter no máximo 100 caracteres"),
  neighborhood: z
    .string()
    .trim()
    .min(5, "O campo 'neighborhood' deve ter pelo menos 5 caracteres")
    .max(200, "O campo 'neighborhood' deve ter no máximo 200 caracteres"),
  street: z
    .string()
    .trim()
    .min(5, "O campo 'street' deve ter pelo menos 5 caracteres")
    .max(200, "O campo 'street' deve ter no máximo 200 caracteres"),
  zip_code: z.string().trim().length(8, "O campo 'zip_code' deve ter exatamente 8 caracteres"),
  number: z
    .string()
    .trim()
    .min(1, "O campo 'number' deve ter pelo menos 1 caracteres")
    .max(20, "O campo 'number' deve ter no máximo 20 caracteres"),
});
