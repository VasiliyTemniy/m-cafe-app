import type { ISessionRepo } from '../interfaces';
import { RedisError } from '@m-cafe-app/utils';
import { Session } from '@m-cafe-app/models';
import { RedisRepoBase } from '../../../utils';


export class SessionRepoRedis extends RedisRepoBase implements ISessionRepo {

  async getAllByUserId(userId: number): Promise<Session[]> {
    const userSessions = await this.redisClient.hGetAll(`user:${String(userId)}`);
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
    const sessionInfo = await this.redisClient.hGet(`user:${String(userId)}`, userAgentHash);
    if (!sessionInfo) return undefined;
    return this.parseSessionInfo(userId, userAgentHash, sessionInfo);
  }

  async create(session: Session) {
    const sessionInfo = `${session.token}:${session.rights}`;
    await this.redisClient.hSet(`user:${String(session.userId)}`, session.userAgentHash, sessionInfo);
    return session;
  }

  async update(session: Session) {
    return await this.create(session);
  }

  async remove(userId: number, userAgentHash?: string): Promise<void> {
    const userAgentHashesToRemove = userAgentHash
      ? userAgentHash
      : await this.redisClient.hKeys(`user:${String(userId)}`);
    await this.redisClient.hDel(`user:${userId}`, userAgentHashesToRemove);
  }

  private parseSessionInfo(userId: number, userAgentOrHash: string, sessionInfo: string): Session {
    const sessionInfoParts = sessionInfo.split(':');
    if (!sessionInfoParts || sessionInfoParts.length !== 2) throw new RedisError(`Somehow data for userId:${userId} and userAgent:${userAgentOrHash} malformed`);
    return new Session(userId, sessionInfoParts[0], userAgentOrHash, sessionInfoParts[1]);
  }
}