import z from "zod";
import { organizationEntitySchema } from "../entity.schema";

export const createOrganizationRequestSchema = organizationEntitySchema.pick({
  name: true,
  cnpj: true,
});
export type CreateOrganizationRequestSchemaType = z.infer<typeof createOrganizationRequestSchema>;
