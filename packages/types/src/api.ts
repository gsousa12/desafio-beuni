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

export type JwtPayloadType = {
  id: string;
  name: string;
  email: string;
};
