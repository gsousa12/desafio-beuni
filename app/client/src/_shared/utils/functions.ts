/**
 * Função para obter o título da etapa atual do processo de cadastro
 * @param currentStep - Número da etapa atual do processo de cadastro
 * @returns Título da etapa atual
 */

export const getCurrentTitle = (currentStep: number): string => {
  switch (currentStep) {
    case 1:
      return "Cadastro de Organização";
    case 2:
      return "Cadastro do Endereço da Organização";
    case 3:
      return "Cadastro de Usuário Administrador";
    default:
      return "Bem-vindo ao nosso aplicativo";
  }
};

/**
 * Função para formatar um valor como CNPJ
 * @param value - Valor a ser formatado como CNPJ
 * @returns Valor formatado como CNPJ no padrão 00.000.000/0000-00
 */
export const formatCNPJ = (value: string): string => {
  if (!value) return "";

  // Remove tudo que não é dígito
  const nums = value.replace(/\D/g, "");

  // Aplica a máscara: 00.000.000/0000-00
  if (nums.length <= 2) {
    return nums;
  } else if (nums.length <= 5) {
    return `${nums.slice(0, 2)}.${nums.slice(2)}`;
  } else if (nums.length <= 8) {
    return `${nums.slice(0, 2)}.${nums.slice(2, 5)}.${nums.slice(5)}`;
  } else if (nums.length <= 12) {
    return `${nums.slice(0, 2)}.${nums.slice(2, 5)}.${nums.slice(5, 8)}/${nums.slice(8)}`;
  } else {
    return `${nums.slice(0, 2)}.${nums.slice(2, 5)}.${nums.slice(5, 8)}/${nums.slice(8, 12)}-${nums.slice(12, 14)}`;
  }
};
