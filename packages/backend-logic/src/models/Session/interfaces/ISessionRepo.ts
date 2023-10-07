import type { Session } from '@m-cafe-app/models';
import type { ICRUDRepo } from '../../../utils';

// SessionDT, SessionDTN does not exist so the arguments are Session
export interface ISessionRepo extends Omit<ICRUDRepo<Session, Session>, 'remove'> {
  getAllByUserId(userId: number): Promise<Session[]>;
  getOne(userId: number, userAgentHash: string): Promise<Session | undefined>;
  remove(userId: number, userAgentHash?: string): Promise<void>;
}