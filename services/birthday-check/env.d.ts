/// <reference types="node" />

declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV?: "development" | "test" | "production";
    REDIS_URL?: string;
    BIRTHDAY_QUEUE_NAME?: string;
    BIRTHDAY_CHECK_CONCURRENCY?: string;
    BATCH_SIZE?: string;
    BATCH_DELAY_MS?: string;
    TIMEZONE?: string;
  }
}
