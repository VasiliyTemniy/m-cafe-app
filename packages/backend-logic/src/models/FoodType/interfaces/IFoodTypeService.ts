import type { FoodTypeDT, FoodTypeDTN } from '@m-cafe-app/models';
import type { ICRUDService } from '../../../utils';

export interface IFoodTypeService extends Omit<ICRUDService<FoodTypeDT, FoodTypeDTN>, 'getAll'> {
  /**
   * @param withFoodOnly - whether to include only food types with at least one associated food entry\
   * Use it to exclude possible dangling food types
   */
  getAll(withFoodOnly: boolean): Promise<FoodTypeDT[]>;
}