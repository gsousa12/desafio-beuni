import z from "zod";
import { userEntitySchema } from "../../../user/schemas/entity.schema";
import { errorSchema } from "app/api-core/src/_shared/schemas/common.schemas";

export const validateResponse = userEntitySchema.pick({
  id: true,
  organization_id: true,
  full_name: true,
  email: true,
});

export const validateResponseSchema = {
  200: z.object({
    status: z.literal("success"),
    message: z.string(),
    meta: z.any(),
    data: z.array(validateResponse),
  }),
  400: errorSchema,
  500: errorSchema,
} as const;
