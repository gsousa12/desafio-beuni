import { passwordSchema } from "app/api-core/src/_shared/schemas/common.schemas";
import z from "zod";
import { userEntitySchema } from "../entity.schema";

export const createUserRequestSchema = z.intersection(
  userEntitySchema.pick({
    organization_id: true,
    full_name: true,
    email: true,
  }),
  z.object({
    password: passwordSchema,
  })
);

export type CreateUserRequestSchemaType = z.infer<typeof createUserRequestSchema>;
