export type PaginationMeta = {
  current_page: number;
  per_page: number;
  total: number;
  total_pages: number;
  has_next: boolean;
  has_previous: boolean;
  next_page: number | null;
  previous_page: number | null;
};

export type ApiSuccessResponseType<T = any> = {
  status: "success";
  message: string;
  meta: PaginationMeta | {};
  data: T[];
};

export type ApiErrorResponseType = {
  status: "error";
  message: string;
};

export type ApiResponseType<T = any> = ApiSuccessResponseType<T> | ApiErrorResponseType;

// Utility types para extrair dados
export type ExtractDataType<T> = T extends ApiSuccessResponseType<infer U> ? U : never;
export type ExtractArrayDataType<T> = T extends ApiSuccessResponseType<infer U> ? U[] : never;
export type ExtractSingleDataType<T> = T extends ApiSuccessResponseType<infer U> ? U : never;
