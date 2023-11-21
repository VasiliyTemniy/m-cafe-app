import type { FoodComponentDT, FoodComponentDTN } from '@m-cafe-app/models';
import type { ICRUDService } from '../../../utils';

export interface IFoodComponentService extends Omit<ICRUDService<FoodComponentDT, FoodComponentDTN>, 'createMany' | 'update' | 'updateMany'> {
  create(foodComponentDTN: FoodComponentDTN): Promise<FoodComponentDT>;
  update(foodComponentDT: FoodComponentDT, foodId: number): Promise<FoodComponentDT>;
  createMany(foodComponentDTNs: FoodComponentDTN[]): Promise<FoodComponentDT[]>;
  rewriteAllForOneFood(updFoodComponents: FoodComponentDTN[], foodId: number): Promise<FoodComponentDT[]>;
  removeMany(ids: number[]): Promise<void>;
}