import { z } from "zod";
import { errorSchema } from "app/api-core/src/_shared/schemas/common.schemas";
import { userAddressEntitySchema, userEntitySchema } from "./user.base.schema";

const createUserResponse = userEntitySchema.omit({
  id: true,
  hash_password: true,
  updated_at: true,
});

export const createUserResponseSchema = {
  201: z.object({
    status: z.literal("success"),
    message: z.string(),
    meta: z.any(),
    data: z.array(createUserResponse),
  }),
  400: errorSchema,
  500: errorSchema,
} as const;

const createAdressResponse = userAddressEntitySchema.omit({
  id: true,
  user_id: true,
  updated_at: true,
});

export const createAdressResponseSchema = {
  201: z.object({
    status: z.literal("success"),
    message: z.string(),
    meta: z.any(),
    data: z.array(createAdressResponse),
  }),
  400: errorSchema,
  500: errorSchema,
} as const;
