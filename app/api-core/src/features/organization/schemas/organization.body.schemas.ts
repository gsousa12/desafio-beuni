import z from "zod";
import { addressBaseSchema, organizationBaseSchema } from "./organization.base.schema";

export const createOrganizationRequestSchema = organizationBaseSchema;
export type CreateOrganizationRequestSchemaType = z.infer<typeof createOrganizationRequestSchema>;

export const createAddressRequestSchema = addressBaseSchema;
export type CreateAddressRequestSchemaType = z.infer<typeof createAddressRequestSchema>;
