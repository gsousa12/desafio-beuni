import z from "zod";
import { userEntitySchema } from "../entity.schema";
import { errorSchema } from "app/api-core/src/_shared/schemas/common.schemas";

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
