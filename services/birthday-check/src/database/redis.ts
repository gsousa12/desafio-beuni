const REDIS_URL = process.env.REDIS_URL!;

export const redisConfig = {
  connection: {
    host: new URL(REDIS_URL).hostname,
    port: Number(new URL(REDIS_URL).port) || 6379,
    password: new URL(REDIS_URL).password || undefined,
  },
};
