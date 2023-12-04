import type { AuthResponse, Session } from '@m-cafe-app/models';
import type { ICRUDService, IHasInmemRepoService } from '../../../utils';

export type DestroySessionWhere = {
  where: {
    userId?: number;
    token?: string;
    userAgent?: string;
  }
};

// SessionDT, SessionDTN does not exist so the arguments are Session
export interface ISessionService extends
  Omit<ICRUDService<Session, Session>, 'remove' | 'create' | 'update' | 'getAll' | 'getById'>,
  IHasInmemRepoService {
  getAllByUserId(userId: number): Promise<Session[]>;
  getOne(userId: number, userAgent: string): Promise<Session | undefined>;
  create(userId: number, token: string, userAgent: string, rights: string): Promise<Session>;
  update(userId: number, token: string, userAgent: string, rights: string): Promise<Session>;
  remove(options: DestroySessionWhere): Promise<void>;
  updateAllByUserId(userId: number, rights: string): Promise<Session[]>;
  cleanRepo(tokenValidator: (req: { token: string }) => AuthResponse): Promise<void>;
}