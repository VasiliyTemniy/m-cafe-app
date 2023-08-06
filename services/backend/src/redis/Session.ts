import { createClient } from 'redis';
import config from '../utils/config.js';
import logger from '../utils/logger.js';
import sha1 from 'sha1';
import {
  ApplicationError,
  hasOwnProperty,
  isNumber,
  isString,
  isUserDT,
  MapToStrings,
  MapToUnknown,
  parseRedisToDT,
  RedisError
} from '@m-cafe-app/utils';
import { User } from '@m-cafe-app/db-models';
import { InferAttributes } from 'sequelize';

const redis = createClient({ ...config.redisConfig, database: 0 });

export const connectToRedisSessionDB = async () => {
  try {
    await redis.connect();
    logger.info('connected to redis');
  } catch (err) {
    logger.error(err as string);
    logger.shout(err as string);
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

  private _userId: number;
  private _token: string;
  private _userAgent: string;

  constructor(
    userId: number,
    token: string,
    userAgent: string
  ) {
    this._userId = userId;
    this._token = token;
    this._userAgent = userAgent;
  }

  get userId(): number {
    return this._userId;
  }

  set userId(value) {
    this._userId = value;
  }

  get token(): string {
    return this._token;
  }

  set token(value) {
    this._token = value;
  }

  get userAgent(): string {
    return this._userAgent;
  }

  set userAgent(value) {
    this._userAgent = value;
  }

  static async create(session: SessionData, rights: string) {
    await this.storeUserRightsCache(session.token, rights);
    const userAgentHash = sha1(session.userAgent);
    return await redis.hSet(`user:${String(session.userId)}:tokens`, userAgentHash, session.token);
  }

  async save(rights: string) {
    await Session.destroy({ where: { userId: this._userId, userAgent: this._userAgent } });

    const session = {
      userId: this._userId,
      token: this._token,
      userAgent: this._userAgent
    };

    return await Session.create(session, rights);
  }

  static async findOne(options: FindOneSessionWhere): Promise<Session | undefined> {
    const userAgentHash = sha1(options.where.userAgent);
    const token = await redis.hGet(`user:${String(options.where.userId)}:tokens`, userAgentHash);
    if (!token) return undefined;
    const sessionData = new Session(options.where.userId, token, options.where.userAgent);
    return sessionData;
  }

  static async findAll(options: FindAllSessionWhere): Promise<Session[]> {
    const userSessions = await redis.hGetAll(`user:${String(options.where.userId)}:tokens`);
    const sessionDatas = [] as Session[];
    for (const key in userSessions) {
      sessionDatas.push(new Session(
        options.where.userId,
        userSessions[key],
        key  // Unfortunately, these are userAgentHashes, but they are used only for checks, not even by tests
      ));
    }
    return sessionDatas;
  }


  static async destroy(options: DestroySessionWhere) {

    const userIdStr = options.where.userId ? String(options.where.userId) : undefined;
    const userAgent = options.where.userAgent;

    if (userIdStr && userAgent) {

      const userAgentHash = sha1(userAgent);
      const token = await redis.hGet(`user:${userIdStr}:tokens`, userAgentHash);

      if (!token) throw new RedisError(`Somehow data for userId:${options.where.userId} and userAgent:${userAgent} malformed`);

      await this.removeUserRightsCache(token);
      return await redis.hDel(`user:${userIdStr}:tokens`, userAgentHash);

    }

    if (userIdStr) {

      const userAgentHashes = await redis.hKeys(`user:${userIdStr}:tokens`);
      const tokens = await redis.hVals(`user:${userIdStr}:tokens`);

      for (const token of tokens) {
        await this.removeUserRightsCache(token);
      }

      return await redis.hDel(`user:${userIdStr}:tokens`, userAgentHashes);

    }

    if (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'dev')
      return await redis.flushDb();
    else
      throw new ApplicationError('Attempt to flush Redis data in prod');
  }

  static async storeUserRightsCache(token: string, rights: string) {
    await redis.set(`token:${token}`, rights);
  }

  static async removeUserRightsCache(token: string) {
    await redis.del(`token:${token}`);
  }

  static async getUserRightsCache(token: string) {
    return redis.get(`token:${token}`);
  }


  // Currently unused
  static async storeUserCache(token: string, userDS: MapToStrings<InferAttributes<User>>) {
    await redis.hSet(`token:${token}`, userDS);
  }

  // Currently unused
  static async removeUserCache(token: string) {
    const userData = await redis.hKeys(`token:${token}`);
    await redis.hDel(`token:${token}`, userData);
  }

  // Currently unused
  static async getUserCache(token: string) {
    const userStrings = await redis.hGetAll(`token:${token}`);

    const user = parseRedisToDT(userStrings);

    if (!isUserDT(user)) throw new RedisError(`Somehow data for ${token} malformed`);

    return user;
  }
}