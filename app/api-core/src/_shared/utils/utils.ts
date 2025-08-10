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

/**
 * Calcula o tempo de execução em segundos desde a data/hora fornecida.
 * @param startTime - A data/hora de início.
 * @returns O tempo de execução em segundos, formatado com três casas decimais.
 */

export const getExecutionTimeSeconds = (startTime: Date): string => {
  const diffMs = Date.now() - startTime.getTime();
  return (diffMs / 1000).toFixed(3);
};

import * as bcrypt from "bcrypt";

/**
 * Função para criptografar uma senha usando bcrypt.
 * @param plainPassword
 * @returns
 */

export const encryptPassword = async (plainPassword: string): Promise<string> => {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
  return hashedPassword;
};

export const mathPassword = async (
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(plainPassword, hashedPassword);
};
