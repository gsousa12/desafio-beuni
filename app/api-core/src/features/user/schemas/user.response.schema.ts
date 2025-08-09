import z from "zod";
import { userEntitySchema } from "./user.base.schema";

export const createUserResponse = userEntitySchema.omit({
  hash_password: true,
  updated_at: true,
});

export const createUserResponseSchema = z.object({
  status: z.literal("success"),
  message: z.string(),
  meta: z.any(),
  data: z.array(createUserResponse),
});
