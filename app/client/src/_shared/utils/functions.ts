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
