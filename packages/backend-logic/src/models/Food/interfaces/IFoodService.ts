import type { FoodDT, FoodDTN } from '@m-cafe-app/models';
import type { ICRUDService } from '../../../utils';

export interface IFoodService extends ICRUDService<FoodDT, FoodDTN> {
  getByIdWithComponents(id: number): Promise<FoodDT>;
}