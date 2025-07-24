import { useState } from "react";
import { useIsMobile } from "@/common/hooks/useIsMobile";
import { useLoginPageController } from "./login-page-controller";
import { ContentWrapper } from "@/common/wrappers/content-wrapper/ContentWrapper";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { LoginFormInputs, loginSchema } from "./login-page-schema";

export const LoginPage = () => {
  const isMobile = useIsMobile();
  const {} = useLoginPageController();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
  });

  const onSubmit = (data: LoginFormInputs) => {
    console.log("Dados do formulário válidos:", data);
  };

  return (
    <ContentWrapper>
      <div
        className={`grid ${isMobile ? "grid-cols-1" : "grid-cols-10"} h-full`}
      >
        {/* Lado Esquerdo */}
        <div
          className={`${
            isMobile ? "hidden" : "col-span-6"
          } bg-gray-100 flex flex-col items-center justify-start p-8`}
        >
          {/* Logo no topo e alinhado à esquerda */}
          <div className="w-full flex justify-start">
            <img
              src="https://dashboard.beuni.com.br/static/media/logo.d9617b18.svg"
              alt="Logo Beuni"
              className="w-[90px] h-[90px]"
            />
          </div>

          {/* Imagem principal centralizada */}
          <div className="flex-grow flex items-center justify-center">
            <img
              src="https://dashboard.beuni.com.br/static/media/login-produtos.11b955c3.png"
              alt="Produtos Beuni"
              className="w-[503px] h-[503px] object-contain"
            />
          </div>
        </div>

        {/* Lado Direito */}
        <div
          className={`${
            isMobile ? "col-span-1" : "col-span-3"
          } bg-white flex flex-col items-center justify-center p-16`}
        >
          <div className="w-full max-w-md">
            {/* Título */}
            <h2 className="text-left text-2xl font-bold mb-2">
              Bem-vindo(a) à BeUni! 👋
            </h2>
            {/* Subtítulo */}
            <p className="text-left text-gray-600 mb-8">
              Faça login para continuar
            </p>
            {/* Formulário de Login */}
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Input de Email */}
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  {...register("email")}
                  className={`w-full p-3 border rounded-md focus:outline-none focus:border-orange-500 ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="seuemail@exemplo.com"
                />
              </div>

              {/* Input de Senha */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-1">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Senha
                  </label>
                  <a
                    href="#"
                    className="text-orange-500 text-sm hover:underline hover:cursor-pointer"
                  >
                    Esqueceu a senha?
                  </a>{" "}
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    {...register("password")}
                    className={`w-full p-3 border rounded-md focus:outline-none focus:border-orange-500 pr-10 ${
                      errors.password ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="********"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 hover:cursor-pointer" // Adicionado cursor-pointer
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Botão de Login */}
              <button
                type="submit"
                className="w-full bg-orange-500 text-white p-3 rounded-md font-semibold hover:bg-orange-600 transition-colors mb-6 hover:cursor-pointer" // Adicionado cursor-pointer
              >
                Entrar
              </button>
            </form>
            <p className="text-center text-gray-600 mb-2">
              Novo na nossa plataforma?
            </p>
            <a
              href="#"
              className="block text-center text-orange-500 font-semibold hover:underline hover:cursor-pointer"
            >
              Crie uma conta
            </a>{" "}
          </div>
        </div>
      </div>
    </ContentWrapper>
  );
};
