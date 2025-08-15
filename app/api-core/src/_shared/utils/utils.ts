import { z } from "zod";
import * as bcrypt from "bcrypt";
import { PaginationMeta } from "packages/types/dist";

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

/**
 * Função para criptografar uma senha usando bcrypt.
 * @param plainPassword - A senha em texto simples a ser criptografada.
 * @returns A senha criptografada.
 */

export const encryptPassword = async (plainPassword: string): Promise<string> => {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
  return hashedPassword;
};

/**
 * Função para comparar uma senha em texto simples com uma senha criptografada.
 * @param plainPassword - A senha em texto simples a ser comparada.
 * @param hashedPassword - A senha criptografada para comparação.
 * @returns Um booleano indicando se as senhas correspondem.
 */
export const matchPassword = async (
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(plainPassword, hashedPassword);
};

/**
 * Função para analisar uma string de data de nascimento no formato "YYYY-MM-DD".
 * Esta função divide a string em ano, mês e dia e retorna um objeto com esses valores.
 * @param dateStr - A string de data no formato "YYYY-MM-DD".
 * @returns - Um objeto contendo o ano, mês e dia da data de nascimento.
 */

type BirthDateParts = {
  birth_date_year: string;
  birth_date_month: string;
  birth_date_day: string;
};

export const parseBirthDate = (date: Date): BirthDateParts => {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    throw new Error("O campo 'birth_date' deve ser uma data válida");
  }

  const iso = date.toISOString();

  const year = iso.slice(0, 4);
  const month = iso.slice(5, 7);
  const day = iso.slice(8, 10);

  if (year.length !== 4 || month.length !== 2 || day.length !== 2) {
    throw new Error("O campo 'birth_date' deve estar no formato 'YYYY-MM-DD'");
  }

  return {
    birth_date_year: year,
    birth_date_month: month,
    birth_date_day: day,
  };
};

/**
 * Função para criar metadados de paginação.
 * @param page
 * @param pageSize
 * @param total
 * @returns
 */

export const createPaginationMeta = (
  page: number,
  pageSize: number,
  total: number
): PaginationMeta => {
  const totalPages = Math.ceil(total / pageSize);

  return {
    current_page: page,
    per_page: pageSize,
    total,
    total_pages: totalPages,
    has_next: page < totalPages,
    has_previous: page > 1,
    next_page: page < totalPages ? page + 1 : null,
    previous_page: page > 1 ? page - 1 : null,
  };
};
