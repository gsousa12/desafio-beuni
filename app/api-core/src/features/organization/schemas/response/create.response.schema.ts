import z from "zod";
import { organizationEntitySchema } from "../entity.schema";
import { errorSchema } from "app/api-core/src/_shared/schemas/common.schemas";

export const createOrganizationResponse = organizationEntitySchema.omit({
  updated_at: true,
});

export const createOrganizationResponseSchema = {
  201: z.object({
    status: z.literal("success"),
    message: z.string(),
    meta: z.any(),
    data: z.array(createOrganizationResponse),
  }),
  400: errorSchema,
  500: errorSchema,
} as const;
