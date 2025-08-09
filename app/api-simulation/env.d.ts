/// <reference types="node" />

declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV?: "development" | "test" | "production";
    API_SIM_PORT?: string;
    API_SIM_HOST?: string;
  }
}
