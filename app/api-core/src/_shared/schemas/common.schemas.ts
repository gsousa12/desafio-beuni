import { z } from "zod";

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

export const errorSchema = z.object({
  status: z.literal("error"),
  message: z.string(),
});
