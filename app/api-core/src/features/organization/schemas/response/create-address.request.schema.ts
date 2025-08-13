import z from "zod";
import { organizationAddressEntitySchema } from "../entity.schema";
import { errorSchema } from "app/api-core/src/_shared/schemas/common.schemas";

const createAdressResponse = organizationAddressEntitySchema.omit({
  id: true,
  organization_id: true,
  updated_at: true,
});

export const createAdressResponseSchema = {
  201: z.object({
    status: z.literal("success"),
    message: z.string(),
    meta: z.any(),
    data: z.array(createAdressResponse),
  }),
  400: errorSchema,
  500: errorSchema,
} as const;
