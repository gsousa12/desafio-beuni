import z from "zod";
import { organizationEntitySchema } from "../entity.schema";

export const createOrganizationRequestSchema = organizationEntitySchema.pick({
  cnpj: true,
  legal_name: true,
  trading_name: true,
});
export type CreateOrganizationRequestSchemaType = z.infer<typeof createOrganizationRequestSchema>;
