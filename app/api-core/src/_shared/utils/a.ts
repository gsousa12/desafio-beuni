import { z } from "zod";

/**
 * Função utilitária para criar um esquema Zod para um tipo de entidade.
 * Isso é útil para definir esquemas específicos para um determinado tipo de entidade.
 *
 * @template T - O tipo da entidade.
 * @returns Uma função que recebe um esquema Zod e o retorna.
 */
export const entitySchemaFromType =
  <T>() =>
  <S extends z.ZodType<T>>(schema: S) =>
    schema;
