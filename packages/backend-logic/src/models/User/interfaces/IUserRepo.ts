import type { User, UserDTN, UserUniqueProperties } from '@m-cafe-app/models';
import type { GenericTransaction, ICRUDRepo } from '../../../utils';

export interface IUserRepo extends Omit<ICRUDRepo<User, UserDTN>, 'create'> {
  getByScope(scope: string): Promise<User[]>;
  getSome(limit: number, offset: number): Promise<User[]>;
  getByUniqueProperties(properties: UserUniqueProperties): Promise<User>;
  create(userDT: UserDTN, silent?: boolean, overrideRights?: string, lookupNoise?: number, tries?: number): Promise<User>;
  // update(user: User): Promise<User>;
  updateLookupHash(user: User, lookupNoise?: number, tries?: number): Promise<User>;
  restore(id: number): Promise<User>;
  delete(id: number): Promise<void>;
  remove(id: number): Promise<User>;
  getWithAddresses(id: number): Promise<User>;
  changeRightsBulk(ids: number[], rights: string, transaction: GenericTransaction): Promise<User[]>;
}