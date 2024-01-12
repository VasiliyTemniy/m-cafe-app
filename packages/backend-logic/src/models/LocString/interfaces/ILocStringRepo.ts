import type { LocString, LocStringDTN } from '@m-cafe-app/models';
import type { GenericTransaction, ICRUDRepo } from '../../../utils';


export interface ILocStringRepo extends ICRUDRepo<LocString, LocStringDTN> {
  /**
   * Does not throw error if no loc string found with this id
   */
  removeWithCount(ids: number[], transaction?: GenericTransaction): Promise<number>;
}