import { ApiErrorResponseType, ApiSuccessResponseType, PaginationMeta } from "@packages/types";
import {
  useMutation,
  useQuery,
  UseMutationOptions,
  UseQueryOptions,
  UseMutationResult,
  UseQueryResult,
} from "@tanstack/react-query";
import { AxiosResponse } from "axios";

export interface ProcessedApiResponse<T> {
  data: T[];
  singleItem: T | null;
  message: string;
  meta: PaginationMeta | {};
  hasPagination: boolean;
  isArray: boolean;
}

export const processSuccessResponse = <T>(
  response: ApiSuccessResponseType<T>
): ProcessedApiResponse<T> => {
  const isArray = Array.isArray(response.data) && response.data.length > 1;
  const hasPagination = response.meta && "current_page" in response.meta;

  return {
    data: response.data,
    singleItem: response.data?.[0] || null,
    message: response.message,
    meta: response.meta,
    hasPagination: Boolean(hasPagination),
    isArray,
  };
};

// Hook customizado para Mutations
export const useApiMutation = <TData, TVariables = void>(
  mutationFn: (variables: TVariables) => Promise<AxiosResponse<ApiSuccessResponseType<TData>>>,
  options?: Omit<
    UseMutationOptions<ProcessedApiResponse<TData>, ApiErrorResponseType, TVariables>,
    "mutationFn"
  >
): UseMutationResult<ProcessedApiResponse<TData>, ApiErrorResponseType, TVariables> => {
  return useMutation({
    mutationFn: async (variables: TVariables) => {
      try {
        const response = await mutationFn(variables);
        return processSuccessResponse(response.data);
      } catch (error: any) {
        const apiError: ApiErrorResponseType = {
          status: "error",
          message: error.response?.data?.message || "Ocorreu um erro no servidor",
        };
        throw apiError;
      }
    },
    ...options,
  });
};

// Hook customizado para Queries
export const useApiQuery = <TData>(
  queryKey: unknown[],
  queryFn: () => Promise<AxiosResponse<ApiSuccessResponseType<TData>>>,
  options?: Omit<
    UseQueryOptions<ProcessedApiResponse<TData>, ApiErrorResponseType>,
    "queryKey" | "queryFn"
  >
): UseQueryResult<ProcessedApiResponse<TData>, ApiErrorResponseType> => {
  return useQuery({
    queryKey,
    queryFn: async () => {
      try {
        const response = await queryFn();
        return processSuccessResponse(response.data);
      } catch (error: any) {
        const apiError: ApiErrorResponseType = {
          status: "error",
          message: error.response?.data?.message || "Ocorreu um erro no servidor",
        };
        throw apiError;
      }
    },
    ...options,
  });
};

// Hooks de conveniência para casos específicos
export const useApiMutationWithHandlers = <TData, TVariables = void>(
  mutationFn: (variables: TVariables) => Promise<AxiosResponse<ApiSuccessResponseType<TData>>>,
  handlers?: {
    onSuccess?: (data: ProcessedApiResponse<TData>) => void;
    onError?: (error: ApiErrorResponseType) => void;
  }
) => {
  return useApiMutation(mutationFn, {
    onSuccess: handlers?.onSuccess,
    onError: handlers?.onError,
  });
};
