import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { AlertPopup } from "@/components/popups/alert-popup/AlertPopup";
import { useLoginPageController } from "../hooks/useLoginPageController";
import { useMobileDetect } from "@/_shared/hooks/useMobileDetect";
import { LoginPageLeftSide } from "../components/login-page-left-side/LoginPageLeftSide";

const loginSchema = z.object({
  email: z.email("E-mail inválido"),
  password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const LoginPage = () => {
  const { handleSubmitLogin, error, isSuccess } = useLoginPageController();
  const isMobile = useMobileDetect();
  const [showPassword, setShowPassword] = useState(false);
  const [openAlertPopUp, setOpenAlertPopUp] = useState(false);

  useEffect(() => {
    error ? setOpenAlertPopUp(true) : setOpenAlertPopUp(false);
    if (isSuccess) {
      alert("Login realizado com sucesso!");
    }
  }, [error, isSuccess]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormValues) => {
    handleSubmitLogin(data);
  };

  return (
    <main className="min-h-screen flex flex-col md:flex-row">
      {/* LADO ESQUERDO (60%) */}
      {!isMobile && (
        <aside className="flex-1 bg-white p-6 md:p-1">
          <div className="h-full flex items-center justify-center">
            <LoginPageLeftSide />
          </div>
        </aside>
      )}

      {/* LADO DIREITO (40%) */}
      <section className={`${isMobile ? "w-full" : "md:w-2/5"} bg-slate-100 p-6 md:p-10`}>
        <div className="h-full flex items-center justify-center">
          <div className="max-w-sm w-full">
            <h1 className="text-xl font-semibold mb-6 text-orange-500">Bem-vindo(a) à BeUni!</h1>
            <p className="text-sm text-gray-600 mb-4">Faça login para continuar</p>

            {/* Formulário */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Campo de E-mail */}
              <div>
                <input
                  type="email"
                  placeholder="john@example.com"
                  {...register("email")}
                  className={`w-full p-3 border rounded-md focus:outline-none focus:border-orange-500 ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                />
              </div>

              {/* Link "Esqueceu a senha?" */}
              <div className="text-right">
                <span
                  className="text-orange-500 text-sm hover:cursor-pointer"
                  onClick={() => console.log("Esqueceu a senha?")}
                >
                  Esqueceu a senha?
                </span>
              </div>

              {/* Campo de Senha */}
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Senha"
                  {...register("password")}
                  className={`w-full p-3 border rounded-md focus:outline-none focus:border-orange-500 ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  }`}
                />
                <div
                  className="absolute top-3 right-3 hover:cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 text-gray-500" />
                  ) : (
                    <Eye className="w-5 h-5 text-gray-500" />
                  )}
                </div>
              </div>

              {/* Botão de Login */}
              <button
                type="submit"
                className="w-full bg-orange-500 text-white py-3 rounded-md hover:bg-orange-600 hover:cursor-pointer"
              >
                Login
              </button>
            </form>

            {/* Links */}
            <div className="text-center mt-6">
              <p className="text-sm text-gray-600">Novo na nossa plataforma?</p>
              <span
                className="text-orange-500 hover:cursor-pointer"
                onClick={() => console.log("Criar conta")}
              >
                Crie uma conta
              </span>
            </div>
          </div>
        </div>
      </section>
      {error && (
        <AlertPopup
          isOpen={openAlertPopUp}
          onClose={() => setOpenAlertPopUp(false)}
          title="Opss!"
          message={error.message}
          status={error.status}
        />
      )}
    </main>
  );
};
