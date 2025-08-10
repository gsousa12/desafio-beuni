import { z } from "zod";

/**
 * Função utilitária para criar um esquema Zod para um tipo de entidade.
 * Garante que o Schema Zod seja tipado corretamente com o tipo da entidade.
 *
 * @template T - O tipo da entidade.
 * @returns Uma função que recebe um esquema Zod e o retorna.
 */
export const entitySchemaFromType =
  <T>() =>
  <S extends z.ZodType<T>>(schema: S) =>
    schema;
