export type ApiSucessResponseType<T = any> = {
  status: "success";
  message: string;
  meta: T & {};
  data: T[];
};

export type ApiErrorResponseType = {
  status: "error";
  message: string;
};
