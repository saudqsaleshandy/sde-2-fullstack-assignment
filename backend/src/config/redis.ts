import IORedis from 'ioredis';
import { env } from './env';

export const redis = new IORedis({
  host: env.redis.host,
  port: env.redis.port,
  maxRetriesPerRequest: null,
});

export const bullConnection = {
  host: env.redis.host,
  port: env.redis.port,
};
