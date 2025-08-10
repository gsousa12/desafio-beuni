import { z } from "zod";
import { errorSchema } from "app/api-core/src/_shared/schemas/common.schemas";
import { userEntitySchema } from "./user.base.schema";

export const createUserResponse = userEntitySchema.omit({
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
