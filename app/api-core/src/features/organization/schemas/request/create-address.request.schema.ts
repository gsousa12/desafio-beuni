import z from "zod";
import { organizationAddressEntitySchema } from "../entity.schema";

export const createAddressRequestSchema = organizationAddressEntitySchema.pick({
  state: true,
  city: true,
  neighborhood: true,
  street: true,
  zip_code: true,
  number: true,
});
export type CreateAddressRequestSchemaType = z.infer<typeof createAddressRequestSchema>;
