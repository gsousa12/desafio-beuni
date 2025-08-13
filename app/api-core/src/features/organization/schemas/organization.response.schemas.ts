import z from "zod";
import { organizationAddressEntitySchema } from "../../user/schemas/user.base.schema";
import { organizationEntitySchema } from "./organization.base.schema";
import { errorSchema } from "app/api-core/src/_shared/schemas/common.schemas";

export const createOrganizationResponse = organizationEntitySchema.omit({
  id: true,
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
