import {
  emailSchema,
  errorSchema,
  passwordSchema,
} from "app/api-core/src/_shared/schemas/common.schemas";
import z from "zod";

const loginResponse = z.object({
  email: emailSchema,
  password: passwordSchema,
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
