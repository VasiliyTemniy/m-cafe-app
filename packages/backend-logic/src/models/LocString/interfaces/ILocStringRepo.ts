import type { LocString, LocStringDTN } from '@m-cafe-app/models';
import type { ICRUDRepo } from '../../../utils';
import type { Transaction } from 'sequelize';


export interface ILocStringRepo extends Omit<ICRUDRepo<LocString, LocStringDTN>, 'create' | 'update'> {
  /**
   * Optionally accepts a transaction
   */
  create(locString: LocStringDTN, t?: Transaction): Promise<LocString>;
  /**
   * Optionally accepts a transaction
   */
  update(locString: LocString, t?: Transaction): Promise<LocString>;
  /**
   * Does not throw error if no loc string found with this id
   */
  removeWithCount(id: number): Promise<number>;
}