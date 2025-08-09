import { passwordSchema } from "app/api-core/src/_shared/schemas/common.schemas";
import { userBaseSchema } from "./user.base.schema";
import { z } from "zod";

export const createUserRequestSchema = userBaseSchema.extend({
  password: passwordSchema,
});

export type CreateUserRequestSchemaType = z.infer<typeof createUserRequestSchema>;
