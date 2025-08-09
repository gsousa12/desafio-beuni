/// <reference types="node" />

declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV?: "development" | "test" | "production";
    API_CORE_PORT?: string;
    API_CORE_HOST?: string;
    DATABASE_URL?: string;
    REDIS_URL?: string;
    API_SIM_BASE_URL?: string;
    BIRTHDAY_QUEUE_NAME?: string;
  }
}
