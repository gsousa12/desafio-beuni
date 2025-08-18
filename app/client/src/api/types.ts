import { ApiErrorResponseType, ApiSuccessResponseType } from "@packages/types";

export type ApiResponseType<T = any> = ApiSuccessResponseType<T> | ApiErrorResponseType;

// Utility types para extrair dados
export type ExtractDataType<T> = T extends ApiSuccessResponseType<infer U> ? U : never;
export type ExtractArrayDataType<T> = T extends ApiSuccessResponseType<infer U> ? U[] : never;
export type ExtractSingleDataType<T> = T extends ApiSuccessResponseType<infer U> ? U : never;
