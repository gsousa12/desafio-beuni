import { z } from "zod";

export const idSchema = z.string().uuid("O campo 'id' deve ser um UUID válido");

export const zipCodeSchema = z
  .string()
  .trim()
  .length(8, "O campo 'zip_code' deve ter exatamente 8 caracteres");

export const cnpjSchema = z
  .string()
  .trim()
  .length(14, "O campo 'tax_id' deve ter exatamente 14 caracteres");

export const emailSchema = z
  .string()
  .trim()
  .min(1, "E-mail é obrigatório")
  .email("O campo 'email' deve ser um e-mail válido")
  .transform((v) => v.toLowerCase());

export const passwordSchema = z
  .string()
  .min(8, "O campo 'password' deve ter pelo menos 8 caracteres")
  .max(100, "O campo 'password' deve ter no máximo 100 caracteres");

export const fullNameSchema = z
  .string()
  .trim()
  .min(5, "O campo 'full-name' deve ter pelo menos 5 caracteres")
  .max(200, "O campo 'full-name' deve ter no máximo 200 caracteres");

export const createdAtSchema = z.coerce.date();
export const updatedAtSchema = z.coerce.date().nullable().optional();
export const deletedAtSchema = z.coerce.date().nullable().optional();

export const errorSchema = z.object({
  status: z.literal("error"),
  message: z.string(),
});

export const stateSchema = z
  .string()
  .length(2, "O campo 'state' deve ter exatamente 2 caracteres")
  .transform((val) => val.toUpperCase())
  .refine((val) => /^[A-Z]{2}$/.test(val), {
    message: "O campo 'state' deve conter apenas letras maiúsculas",
  });

export const nameSchema = z
  .string()
  .trim()
  .min(3, "O campo 'name' deve ter pelo menos 3 caracteres")
  .max(100, "O campo 'name' deve ter no máximo 100 caracteres");

export const descriptionSchema = z
  .string()
  .trim()
  .nullable()
  .optional()
  .refine((val) => val === null || val === undefined || (val.length >= 3 && val.length <= 100), {
    message: "O campo 'description' deve ter entre 3 e 100 caracteres",
  });

export const citySchema = z
  .string()
  .trim()
  .min(3, "O campo 'city' deve ter pelo menos 3 caracteres")
  .max(100, "O campo 'city' deve ter no máximo 100 caracteres");

export const neighborhoodSchema = z
  .string()
  .trim()
  .min(5, "O campo 'neighborhood' deve ter pelo menos 5 caracteres")
  .max(200, "O campo 'neighborhood' deve ter no máximo 200 caracteres");

export const streetSchema = z
  .string()
  .trim()
  .min(5, "O campo 'neighborhood' deve ter pelo menos 5 caracteres")
  .max(200, "O campo 'neighborhood' deve ter no máximo 200 caracteres");

export const residentialNumberSchema = z
  .string()
  .trim()
  .min(1, "O campo 'number' deve ter pelo menos 1 caracteres")
  .max(20, "O campo 'number' deve ter no máximo 20 caracteres");

export const cpfSchema = z
  .string()
  .trim()
  .length(11, "O campo 'cpf' deve ter exatamente 11 caracteres");

export const phoneSchema = z
  .string()
  .trim()
  .max(15, "O campo 'phone' deve ter no máximo 15 caracteres");

export const birthDateSchema = z.date().refine((date) => date <= new Date(), {
  message: "O campo 'birth_date' deve ser uma data válida no passado ou presente",
});

export const positionSchema = z
  .string()
  .trim()
  .max(100, "O campo 'position' deve ter no máximo 100 caracteres");
