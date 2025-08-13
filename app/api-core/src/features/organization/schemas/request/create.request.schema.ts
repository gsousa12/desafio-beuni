import { cnpjSchema } from "app/api-core/src/_shared/schemas/common.schemas";
import z from "zod";
import { organizationEntitySchema } from "../entity.schema";

export const createOrganizationRequestSchema = organizationEntitySchema.pick({
  name: true,
  cnpj: true,
});
export type CreateOrganizationRequestSchemaType = z.infer<typeof createOrganizationRequestSchema>;
