import type { RedisClientOptions, RedisFunctions, RedisModules, RedisScripts } from '@redis/client';
import { ApplicationError } from '@m-cafe-app/utils';
import * as dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { createClient } from 'redis';

export const isDockerized = (process.env.DOCKERIZED_DEV === 'true' || process.env.DOCKERIZED === 'true');

dotenv.config({
  override: isDockerized ? false : true
});

const SUPERADMIN_PHONENUMBER = process.env.SUPERADMIN_PHONENUMBER;
if (!SUPERADMIN_PHONENUMBER) throw new ApplicationError('SUPERADMIN_PHONENUMBER not set');

const redisUseTLS = process.env.REDIS_TLS as string === 'true';

const redisConfig: RedisClientOptions<RedisModules, RedisFunctions, RedisScripts> = {
  username: process.env.REDIS_USERNAME as string,
  password: process.env.REDIS_PASSWORD as string,
  socket: {
    host: process.env.REDIS_HOST as string,
    port: Number(process.env.REDIS_PORT as string),
    tls: redisUseTLS,
    key: redisUseTLS ? readFileSync('./cert/redis_user_private.key') : undefined,
    cert: redisUseTLS ? readFileSync('./cert/redis_user.crt') : undefined,
    ca: redisUseTLS ? [readFileSync('./cert/redis_ca.pem')] : undefined
  },
};

export const redisSessionClient = createClient({ ...redisConfig, database: 0 });
export const redisUiSettingsClient = createClient({ ...redisConfig, database: 1 });
export const redisFixedLocsClient = createClient({ ...redisConfig, database: 2 });

export default {
  SUPERADMIN_PHONENUMBER
};