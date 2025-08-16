/**
 * Gera um número inteiro aleatório entre 100 e 500 (inclusive).
 *
 * @returns {number} Número aleatório entre 100 e 500.
 */
export const getRandomShippingCost = (): number => {
  return Math.floor(Math.random() * (1000 - 100 + 1)) + 100;
};

/**
 * Gera uma data aleatória entre hoje e os próximos 5 dias.
 *
 * @returns {Date} Objeto Date representando a data aleatória.
 */
export const getRandomExpectedArrival = (): string => {
  const now = Date.now();
  const fiveDaysInMs = 5 * 24 * 60 * 60 * 1000;
  const randomOffset = Math.floor(Math.random() * (fiveDaysInMs + 1));
  return new Date(now + randomOffset).toISOString();
};

/**
 * Retorna uma Promise que resolve para `true` em 90% das vezes e `false` em 10%,
 * após um atraso aleatório entre 2 e 10 segundos.
 *
 * @returns {Promise<boolean>} Promise resolvida com o resultado (true/false).
 */
export const randomSuccessRate = async (): Promise<boolean> => {
  const delay = Math.floor(Math.random() * (10 - 2 + 1) + 2) * 1000; // 2 a 10 segundos em ms

  return new Promise((resolve) => {
    setTimeout(() => {
      const success = Math.random() < 0.9; // 90% chance de true
      resolve(success);
    }, delay);
  });
};
