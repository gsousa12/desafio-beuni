import { cnpjSchema } from "app/api-core/src/_shared/schemas/common.schemas";
import { entitySchemaFromType } from "app/api-core/src/_shared/utils/utils";
import { OrganizationEntity } from "packages/types/dist";
import z from "zod";

export const organizationEntitySchema = entitySchemaFromType<OrganizationEntity>()(
  z.object({
    id: z.string().uuid(),
    name: z.string(),
    cnpj: z.string(),
    created_at: z.date(),
    updated_at: z.date().optional().nullable(),
  })
);

export const organizationBaseSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "O campo 'name' deve ter pelo menos 3 caracteres")
    .max(200, "O campo 'name' deve ter no máximo 200 caracteres"),
  cnpj: cnpjSchema,
});

export const addressBaseSchema = z.object({
  state: z.string().trim().length(2, "O campo 'state' deve ter exatamente 2 caracteres"),
  city: z
    .string()
    .trim()
    .min(3, "O campo 'city' deve ter pelo menos 3 caracteres")
    .max(100, "O campo 'city' deve ter no máximo 100 caracteres"),
  neighborhood: z
    .string()
    .trim()
    .min(5, "O campo 'neighborhood' deve ter pelo menos 5 caracteres")
    .max(200, "O campo 'neighborhood' deve ter no máximo 200 caracteres"),
  street: z
    .string()
    .trim()
    .min(5, "O campo 'street' deve ter pelo menos 5 caracteres")
    .max(200, "O campo 'street' deve ter no máximo 200 caracteres"),
  zip_code: z.string().trim().length(8, "O campo 'zip_code' deve ter exatamente 8 caracteres"),
  number: z
    .string()
    .trim()
    .min(1, "O campo 'number' deve ter pelo menos 1 caracteres")
    .max(20, "O campo 'number' deve ter no máximo 20 caracteres"),
});
