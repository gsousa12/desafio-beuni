import { useApiMutation } from "@/api/api.hooks";
import { JwtPayloadType, UserEntity } from "@packages/types";
import { LoginFormValues } from "../pages/LoginPage";
import { api } from "@/api/axios";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/auth.store";

type LoginApiResponseData = Pick<UserEntity, "email" | "full_name">;
type ValidateApiResponseData = JwtPayloadType;
type ValidateRequest = {};

export const useLoginPageController = () => {
  const navigate = useNavigate();
  const setAuthenticated = useAuthStore((state) => state.setAuthenticated);
  const setUser = useAuthStore((state) => state.setUser);

  const { mutateAsync: validateJWT } = useApiMutation<ValidateApiResponseData, ValidateRequest>(
    (req) => api.post("auth/validate", req)
  );

  const {
    mutateAsync: submitLogin,
    data,
    isPending,
    isError,
    isSuccess,
    error,
  } = useApiMutation<LoginApiResponseData, LoginFormValues>(
    (loginData) => api.post("auth/login", loginData),
    {
      onSuccess: async () => {
        try {
          const result = await validateJWT({});
          const resultUser = result.data[0]!;
          console.log(resultUser);
          setUser(resultUser);
          setAuthenticated(true);
          navigate("/dashboard", { replace: true });
        } catch (error) {
          throw new Error("Falha ao validar o token JWT.");
        }
      },
      onError: (error) => {
        console.error("Erro no login:", error);
        alert("Falha no login. Verifique suas credenciais.");
      },
    }
  );

  const handleSubmitLogin = async (formData: LoginFormValues) => {
    try {
      const result = await submitLogin(formData);
      return result;
    } catch (error: any) {
      throw error;
    }
  };

  return {
    handleSubmitLogin,
    isPending,
    isError,
    isSuccess,
    error,
    userData: data?.singleItem,
    userMessage: data?.message,
    allData: data?.data,
    errorMessage: data?.message,
  };
};
