import { emailSchema, passwordSchema } from "app/api-core/src/_shared/schemas/common.schemas";
import z from "zod";

export const loginRequestSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});
export type loginRequestSchemaType = z.infer<typeof loginRequestSchema>;
