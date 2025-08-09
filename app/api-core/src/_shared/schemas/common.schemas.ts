import { z } from "zod";

export const emailSchema = z
  .string()
  .trim()
  .min(1, "E-mail é obrigatório")
  .email("E-mail inválido")
  .transform((v) => v.toLowerCase());

export const passwordSchema = z.string().min(8, "Senha deve ter ao menos 8 caracteres");

export const fullNameSchema = z
  .string()
  .trim()
  .min(1, "Nome completo é obrigatório")
  .max(200, "Nome muito longo");

export const createdAtSchema = z.coerce.date();
export const updatedAtSchema = z.coerce.date().nullable().optional();
