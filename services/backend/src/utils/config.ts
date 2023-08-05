import { RedisClientOptions, RedisFunctions, RedisModules, RedisScripts } from "@redis/client";
import * as dotenv from "dotenv";
import { readFileSync } from "fs";

const isDockerized = (process.env.DOCKERIZED_DEV === 'true' || process.env.DOCKERIZED === 'true');

dotenv.config({
  override: isDockerized ? false : true
});

import { Secret } from 'jsonwebtoken';

const PORT = process.env.BACKEND_PORT as string;

const DATABASE_URL = process.env.NODE_ENV === 'test'
  ? process.env.TEST_DATABASE_URL as string
  : process.env.DATABASE_URL as string;

const SECRET = process.env.SECRET as Secret;

const TOKEN_TTL = process.env.TOKEN_TTL as string;

const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN as string;

const SUPERADMIN_PHONENUMBER = process.env.SUPERADMIN_PHONENUMBER as string;


const redisUseTLS = process.env.REDIS_TLS as string === 'true';

const redisConfig: RedisClientOptions<RedisModules, RedisFunctions, RedisScripts> = {

  username: process.env.REDIS_USERNAME as string,
  password: process.env.REDIS_PASSWORD as string,
  socket: {
    host: process.env.REDIS_HOST as string,
    port: Number(process.env.REDIS_PORT as string),
    tls: redisUseTLS,
    key: redisUseTLS ? readFileSync('./redis_user_private.key') : undefined,
    cert: redisUseTLS ? readFileSync('./redis_user.crt') : undefined,
    ca: redisUseTLS ? [readFileSync('./redis_ca.pem')] : undefined
  },

};


export default {
  DATABASE_URL,
  PORT,
  SECRET,
  TOKEN_TTL,
  ALLOWED_ORIGIN,
  SUPERADMIN_PHONENUMBER,
  redisConfig
};