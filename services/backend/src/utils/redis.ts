import { isUserDT, UserDT } from '@m-cafe-app/utils';
import { createClient, RedisClientType } from 'redis';
import config from './config.js';
import logger from './logger.js';


export const redis = createClient(config.redisConfig);

export const connectToRedis = async () => {
  try {
    await redis.connect();
    logger.info('connected to redis');
  } catch (err) {
    logger.error(err as string);
    logger.info('failed to connect to redis');
    return process.exit(1);
  }

  return null;
};


export const getUserTokens = (client: RedisClientType, userId: number) =>
  client.sMembers(`user:${userId}:tokens`);


export const addUserToken = (client: RedisClientType, userId: number, token: string) =>
  client.sAdd(`user:${userId}:tokens`, token);


export const removeUserTokens = (client: RedisClientType, userId: number, tokens: string | string[]) =>
  client.sRem(`user:${userId}:tokens`, tokens);


export const setTokenUser = (client: RedisClientType, token: string, user: UserDT) =>
  client.hSet(`token:${token}`, { ...user, admin: String(user.admin), disabled: String(user.disabled) });


export const getTokenUser = async (client: RedisClientType, token: string): Promise<UserDT> => {
  const userFromRedis = await client.hGetAll(`token:${token}`);

  const user = {
    ...userFromRedis,
    admin: Boolean(userFromRedis.admin),
    disabled: Boolean(userFromRedis.disabled)
  };

  if (!isUserDT(user)) throw new Error();

  return user;
};