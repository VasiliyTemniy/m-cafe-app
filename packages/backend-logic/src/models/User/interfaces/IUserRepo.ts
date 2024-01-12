import type { User, UserDTN, UserUniqueProperties } from '@m-market-app/models';
import type { GenericTransaction, ICRUDRepo } from '../../../utils';

export interface IUserRepo extends Omit<ICRUDRepo<User, UserDTN>, 'create'> {
  getByScope(scope: string, transaction?: GenericTransaction): Promise<User[]>;
  getSome(limit: number, offset: number, scope?: string, transaction?: GenericTransaction): Promise<User[]>;
  getByUniqueProperties(properties: UserUniqueProperties, transaction?: GenericTransaction): Promise<User>;
  create(
    userDT: UserDTN,
    silent?: boolean,
    overrideRights?: string,
    lookupNoise?: number,
    tries?: number,
    transaction?: GenericTransaction
  ): Promise<User>;
  updateLookupHash(user: User, lookupNoise?: number, tries?: number, transaction?: GenericTransaction): Promise<User>;
  restore(id: number, transaction?: GenericTransaction): Promise<User>;
  delete(id: number, transaction?: GenericTransaction): Promise<void>;
  /**
   * Method works only for node_env===test
   * Difference - check for voluntary deletion is omitted
   */
  deleteForTest(id: number, transaction?: GenericTransaction): Promise<void>;
  remove(id: number, transaction?: GenericTransaction): Promise<User>;
  removeAll(keepSuperAdmin?: boolean): Promise<void>;
  getWithAddresses(id: number, transaction?: GenericTransaction): Promise<User>;
  changeRightsBulk(ids: number[], rights: string, transaction: GenericTransaction): Promise<User[]>;
}