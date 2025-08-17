import { useApiMutation } from "@/api/api.hooks";
import { UserEntity } from "@packages/types";
import { LoginFormValues } from "../pages/LoginPage";
import { api } from "@/api/axios";

type ApiResponseData = Pick<UserEntity, "email" | "full_name">;

export const useLoginPageController = () => {
  const {
    mutateAsync: submitLogin,
    data,
    isPending,
    isError,
    isSuccess,
    error,
  } = useApiMutation<ApiResponseData, LoginFormValues>((loginData) =>
    api.post("auth/login", loginData)
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
