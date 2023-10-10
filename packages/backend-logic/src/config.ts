import type { RedisClientOptions, RedisFunctions, RedisModules, RedisScripts } from '@redis/client';
import type { CookieOptions } from 'express';
import { ApplicationError } from '@m-cafe-app/utils';
import * as dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { createClient } from 'redis';
import { loadSync } from '@grpc/proto-loader';

export const isDockerized = (process.env.DOCKERIZED_DEV === 'true' || process.env.DOCKERIZED === 'true');

dotenv.config({
  override: isDockerized ? false : true
});

const SUPERADMIN_PHONENUMBER = process.env.SUPERADMIN_PHONENUMBER;
if (!SUPERADMIN_PHONENUMBER) throw new ApplicationError('SUPERADMIN_PHONENUMBER not set');

const TOKEN_TTL = process.env.TOKEN_TTL
  ? process.env.TOKEN_TTL
  : '1d';

const cookieExpiracyMS =
  TOKEN_TTL.endsWith('s') ? Number(TOKEN_TTL.slice(0, TOKEN_TTL.length - 1)) * 1000 :
  TOKEN_TTL.endsWith('m') ? Number(TOKEN_TTL.slice(0, TOKEN_TTL.length - 1)) * 60 * 1000 :
  TOKEN_TTL.endsWith('h') ? Number(TOKEN_TTL.slice(0, TOKEN_TTL.length - 1)) * 60 * 60 * 1000 :
  TOKEN_TTL.endsWith('d') ? Number(TOKEN_TTL.slice(0, TOKEN_TTL.length - 1)) * 24 * 60 * 60 * 1000
  : Number(TOKEN_TTL);

const sessionCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production'
};

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

const __dirname = process.cwd();

const authProtoPath = process.platform === 'win32'
  ? __dirname + '\\src\\protos\\auth.proto'
  : __dirname + '/src/protos/auth.proto';

console.log(authProtoPath, __dirname);

const packageDefinitionAuth = loadSync(
  authProtoPath,
  {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
  }
);

const authUrl = process.env.AUTH_MICROSERVICE_URL;
if (!authUrl) throw new ApplicationError('AUTH_MICROSERVICE_URL not set');


export default {
  SUPERADMIN_PHONENUMBER,
  cookieExpiracyMS,
  sessionCookieOptions,
  packageDefinitionAuth,
  authUrl
};