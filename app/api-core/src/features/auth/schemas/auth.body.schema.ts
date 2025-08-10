import z from "zod";
import { createUserRequestSchema } from "../../user/schemas/user.body.schema";

export const loginRequestSchema = createUserRequestSchema.pick({
  email: true,
  password: true,
});

export type loginRequestSchemaType = z.infer<typeof loginRequestSchema>;
