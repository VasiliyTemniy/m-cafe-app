import type { User, UserDTN, UserUniqueProperties } from '@m-cafe-app/models';
import type { ICRUDRepo } from '../../../utils';

export interface IUserRepo extends ICRUDRepo<User, UserDTN> {
  getByScope(scope: string): Promise<User[]>;
  getSome(limit: number, offset: number): Promise<User[]>;
  getByUniqueProperties(properties: UserUniqueProperties): Promise<User>;
  getPasswordHashRights(id: number): Promise<{ id: number; rights: string; passwordHash: string}>;
  create(userDT: UserDTN, passwordHash: string, silent?: boolean, overrideRights?: string): Promise<User>;
  update(user: User, passwordHash?: string): Promise<User>;
  restore(id: number): Promise<User>;
  delete(id: number): Promise<void>;
  remove(id: number): Promise<User>;
}