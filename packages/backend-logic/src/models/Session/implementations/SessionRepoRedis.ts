import type { ISessionRepo } from '../interfaces';
import {
  ApplicationError,
  RedisError
} from '@m-cafe-app/utils';
import { Session } from '@m-cafe-app/models';
import { redisSessionClient } from '../../../config';
import { logger } from '@m-cafe-app/utils';


export class SessionRepoRedis implements ISessionRepo {

  getAll(): Promise<Session[]> {
    throw new ApplicationError('Not implemented');
  }

  getById(): Promise<Session> {
    throw new ApplicationError('Not implemented');
  }

  async getAllByUserId(userId: number): Promise<Session[]> {
    const userSessions = await redisSessionClient.hGetAll(`user:${String(userId)}`);
    const sessionDatas = [] as Session[];
    for (const userAgentHash in userSessions) {
      const sessionInfo = userSessions[userAgentHash];
      sessionDatas.push(
        this.parseSessionInfo(userId, userAgentHash, sessionInfo)
      );
    }
    return sessionDatas;
  }

  async getOne(userId: number, userAgentHash: string): Promise<Session | undefined> {
    const sessionInfo = await redisSessionClient.hGet(`user:${String(userId)}`, userAgentHash);
    if (!sessionInfo) return undefined;
    return this.parseSessionInfo(userId, userAgentHash, sessionInfo);
  }

  async create(session: Session) {
    const sessionInfo = `${session.token}:${session.rights}`;
    await redisSessionClient.hSet(`user:${String(session.userId)}`, session.userAgentHash, sessionInfo);
    return session;
  }

  async update(session: Session) {
    await this.remove(session.userId, session.userAgentHash);
    return await this.create(session);
  }

  async remove(userId: number, userAgentHash?: string): Promise<void> {
    const userAgentHashesToRemove = userAgentHash
      ? userAgentHash
      : await redisSessionClient.hKeys(`user:${String(userId)}`);
    await redisSessionClient.hDel(`user:${userId}`, userAgentHashesToRemove);
  }

  async removeAll(): Promise<void> {
    await redisSessionClient.flushDb();
  }

  private parseSessionInfo(userId: number, userAgentOrHash: string, sessionInfo: string): Session {
    const sessionInfoParts = sessionInfo.split(':');
    if (!sessionInfoParts || sessionInfoParts.length !== 2) throw new RedisError(`Somehow data for userId:${userId} and userAgent:${userAgentOrHash} malformed`);
    return new Session(userId, sessionInfoParts[0], userAgentOrHash, sessionInfoParts[1]);
  }

  async connect(): Promise<void> {
    try {
      await redisSessionClient.connect();
      logger.info('connected to redis');
    } catch (err) {
      logger.error(err as string);
      logger.info('failed to connect to redis');
      if (process.env.NODE_ENV === 'production') {
        await new Promise((resolve) => setTimeout(resolve, 5000));
        await this.connect();
      }
      return process.exit(1);
    }
  }

  async ping(): Promise<void> {
    try {
      await redisSessionClient.ping();
    } catch (err) {
      logger.error(err as string);
      logger.info('failed to ping redis');
      if (process.env.NODE_ENV === 'production') {
        await new Promise((resolve) => setTimeout(resolve, 5000));
        await this.close();
        await this.connect();
        await this.ping();
      }
      return process.exit(1);
    }
  }

  async close(): Promise<void> {
    await redisSessionClient.quit();
  }
}