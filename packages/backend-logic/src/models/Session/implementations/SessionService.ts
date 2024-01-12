import type { DestroySessionWhere, ISessionRepo, ISessionService } from '../interfaces';
import { AuthResponse, Session } from '@m-market-app/models';
import { ApplicationError } from '@m-market-app/utils';
import sha1 from 'sha1';


export class SessionService implements ISessionService {
  constructor( readonly repo: ISessionRepo ) {}

  async getAllByUserId(userId: number): Promise<Session[]> {
    return await this.repo.getAllByUserId(userId);
  }

  async getOne(userId: number, userAgent: string): Promise<Session | undefined> {
    const userAgentHash = sha1(userAgent);
    return await this.repo.getOne(userId, userAgentHash);
  }

  async create(userId: number, token: string, userAgent: string, rights: string): Promise<Session> {
    const userAgentHash = sha1(userAgent);
    return await this.repo.create(new Session(userId, token, userAgentHash, rights));
  }

  async update(userId: number, token: string, userAgent: string, rights: string): Promise<Session> {
    const userAgentHash = sha1(userAgent);
    return await this.repo.update(new Session(userId, token, userAgentHash, rights));
  }

  async refresh(userId: number, token: string, userAgent: string): Promise<Session> {
    const userAgentHash = sha1(userAgent);

    const userSession = await this.repo.getOne(userId, userAgentHash);
    if (!userSession) {
      throw new ApplicationError('User session not found. Please, login again');
    }

    return await this.repo.update(new Session(userId, token, userAgentHash, userSession.rights));
  }

  async updateAllByUserId(userId: number, rights: string): Promise<Session[]> {
    const userSessions = await this.getAllByUserId(userId);
    const newSessions: Session[] = [];

    for (const session of userSessions) {
      const updatedSession = await this.repo.update(new Session(userId, session.token, session.userAgentHash, rights));
      newSessions.push(updatedSession);
    }
    return newSessions;
  }

  async remove(options: DestroySessionWhere): Promise<void> {
    const userId = options.where.userId;
    const userAgent = options.where.userAgent;

    if (userId && userAgent) {
      return await this.repo.remove(userId, sha1(userAgent));
    }

    if (userId) {
      return await this.repo.remove(userId);
    }

    return await this.removeAll();
  }

  async removeAll(): Promise<void> {
    if (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'dev') {
      await this.repo.removeAll();
      return;
    } else {
      throw new ApplicationError('Attempt to flush Redis data in prod');
    }
  }

  async connectInmem(): Promise<void> {
    await this.repo.connect();
  }

  async pingInmem(): Promise<void> {
    await this.repo.ping();
  }

  async closeInmem(): Promise<void> {
    await this.repo.close();
  }

  async flushInmem(): Promise<void> {
    await this.repo.removeAll();
  }

  async cleanRepo(tokenValidator: (req: { token: string; }) => AuthResponse): Promise<void> {
    await this.repo.cleanRepo(tokenValidator);
  }

}