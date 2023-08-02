import { createClient } from 'redis';
import config from '../utils/config.js';
import logger from '../utils/logger.js';
import sha1 from 'sha1';
import { hasOwnProperty, isNumber, isString, isUserDT, MapToUnknown, RedisError, UserDT } from '@m-cafe-app/utils';

const redis = createClient({ ...config.redisConfig, database: 0 });

export const connectToRedisSessionDB = async () => {
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

interface SessionData {
  userId: number;
  token: string;
  userAgent: string;
}

interface FindOneSessionWhere {
  where: {
    userId: number;
    token?: string;
    userAgent: string;
  };
}

interface FindAllSessionWhere {
  where: {
    userId: number;
    token?: string;
    userAgent?: string;
  };
}

interface DestroySessionWhere {
  where: {
    userId?: number;
    token?: string;
    userAgent?: string;
  };
}

const hasSessionDataFields = (obj: unknown): obj is MapToUnknown<SessionData> =>
  hasOwnProperty(obj, 'userId') && hasOwnProperty(obj, 'token') && hasOwnProperty(obj, 'userAgent');

export const isSessionData = (obj: unknown): obj is SessionData =>
  hasSessionDataFields(obj) && isNumber(obj.userId) && isString(obj.token) && isString(obj.userAgent);


/**
 * Mostly mimics after already defined sequelize model Session to rewrite less code
 * But adds special layer for caching user data for userCheck middleware
 */
export class Session {
  constructor(
    userId: number,
    token: string,
    userAgent: string
  ) {
    this.userId = userId;
    this.token = token;
    this.userAgent = userAgent;
  }

  userId: number;
  token: string;
  userAgent: string;

  static async create(session: SessionData, user: UserDT) {
    await this.storeUserCache(session.token, user);
    const userAgentHash = sha1(session.userAgent);
    return await redis.hSet(`user:${session.userId}:tokens`, userAgentHash, session.token);
  }

  async save(user: UserDT) {
    const userAgentHash = sha1(this.userAgent);
    await Session.destroy({ where: { userId: this.userId, userAgent: userAgentHash } });

    const session = {
      userId: this.userId,
      token: this.token,
      userAgent: userAgentHash
    };

    return await Session.create(session, user);
  }

  static async findOne(options: FindOneSessionWhere): Promise<Session | undefined> {
    const userAgentHash = sha1(options.where.userAgent);
    const token = await redis.hGet(`user:${options.where.userId}:tokens`, userAgentHash);
    if (!token) return undefined;
    const sessionData = new Session(options.where.userId, token, options.where.userAgent);
    return sessionData;
  }

  static async findAll(options: FindAllSessionWhere): Promise<Session[]> {
    const userSessions = await redis.hGetAll(`user:${options.where.userId}:tokens`);
    const sessionDatas = [] as Session[];
    for (const key in userSessions) {
      sessionDatas.concat(new Session(
        options.where.userId,
        userSessions[key],
        key  // Unfortunately, these are userAgentHashes, but they are used only for checks, not even by tests
      ));
    }
    return sessionDatas;
  }

  static async destroy(options: DestroySessionWhere) {

    if (options.where.userId && options.where.userAgent) {

      const userAgentHash = sha1(options.where.userAgent);
      const token = await redis.hGet(`user:${options.where.userId}:tokens`, userAgentHash);

      if (!token) throw new RedisError(`Somehow data for userId:${options.where.userId} and userAgent:${options.where.userAgent} malformed`);

      await this.removeUserCache(token);
      return await redis.hDel(`user:${options.where.userId}:tokens`, options.where.userAgent);

    }

    if (options.where.userId) {

      const userAgentHashes = await redis.hKeys(`user:${options.where.userId}:tokens`);
      const tokens = await redis.hVals(`user:${options.where.userId}:tokens`);

      for (const token of tokens) {
        await this.removeUserCache(token);
      }

      return await redis.hDel(`user:${options.where.userId}:tokens`, userAgentHashes);

    }

    return await redis.flushDb();
  }

  static async storeUserCache(token: string, user: UserDT) {
    await redis.hSet(`token:${token}`, { ...user, admin: String(user.admin), disabled: String(user.disabled) });
  }

  static async removeUserCache(token: string) {
    const userData = await redis.hKeys(`token:${token}`);
    await redis.hDel(`token:${token}`, userData);
  }

  static async getUserCache(token: string) {
    const userFromRedis = await redis.hGetAll(`token:${token}`);

    const user = {
      ...userFromRedis,
      admin: Boolean(userFromRedis.admin),
      disabled: Boolean(userFromRedis.disabled)
    };

    if (!isUserDT(user)) throw new RedisError(`Somehow data for ${token} malformed`);

    return user;
  }

}