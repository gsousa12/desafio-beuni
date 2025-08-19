import {
  citySchema,
  cnpjSchema,
  emailSchema,
  nameSchema,
  neighborhoodSchema,
  passwordSchema,
  residentialNumberSchema,
  stateSchema,
  streetSchema,
  zipCodeSchema,
} from "@/_shared/schemas/common.schemas";
import z from "zod";

export const organizationSchema = z.object({
  cnpj: cnpjSchema,
  legal_name: nameSchema,
  trading_name: nameSchema,
});

export const addressSchema = z.object({
  state: stateSchema,
  city: citySchema,
  neighborhood: neighborhoodSchema,
  street: streetSchema,
  zip_code: zipCodeSchema,
  number: residentialNumberSchema,
});

export const userSchema = z.object({
  full_name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
});

export type OrganizationFormData = z.infer<typeof organizationSchema>;
export type AddressFormData = z.infer<typeof addressSchema>;
export type UserFormData = z.infer<typeof userSchema>;
