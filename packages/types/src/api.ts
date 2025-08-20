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

export type JwtPayloadType = {
  id: string;
  organization_id: string;
  full_name: string;
  email: string;
};

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

export type PaginatedResult<T> = {
  data: T[];
  meta: PaginationMeta;
};
