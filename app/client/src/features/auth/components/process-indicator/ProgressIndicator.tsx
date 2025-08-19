interface ProgressIndicatorProps {
  currentStep: number;
}

const formCurrentStepMessage = (step: number): string => {
  switch (step) {
    case 1:
      return "Registre sua organização com base nas informações legais";
    case 2:
      return "Cadastre o endereço de sua organização";
    case 3:
      return "Agora cadastre o usuário administrador";
    default:
      return "Bem-vindo ao nosso aplicativo";
  }
};

export const ProgressIndicator = ({ currentStep }: ProgressIndicatorProps) => (
  <div className="mb-8">
    <div className="flex items-center justify-between mb-4">
      {[1, 2, 3].map((step) => (
        <div key={step} className="flex items-center">
          <div
            className={`
                w-10 h-10 rounded-full flex items-center justify-center font-semibold
                ${currentStep >= step ? "bg-orange-500 text-white" : "bg-gray-200 text-gray-500"}
              `}
          >
            {step}
          </div>
          {step < 3 && (
            <div
              className={`
                  h-1 w-24 mx-18
                  ${currentStep > step ? "bg-orange-500" : "bg-gray-200"}
                `}
            />
          )}
        </div>
      ))}
    </div>
    <div className="text-center text-sm text-gray-600">{formCurrentStepMessage(currentStep)}</div>
  </div>
);
