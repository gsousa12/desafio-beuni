import { errorSchema } from "app/api-core/src/_shared/schemas/common.schemas";
import z from "zod";
import { userEntitySchema } from "../../user/schemas/user.base.schema";

const loginResponse = userEntitySchema.pick({
  full_name: true,
  email: true,
});

export const loginResponseSchema = {
  200: z.object({
    status: z.literal("success"),
    message: z.string(),
    meta: z.any(),
    data: z.array(loginResponse),
  }),
  400: errorSchema,
  500: errorSchema,
} as const;
