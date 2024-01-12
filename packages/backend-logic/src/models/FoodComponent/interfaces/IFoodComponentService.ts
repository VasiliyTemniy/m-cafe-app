import type { FoodComponentDT, FoodComponentDTN } from '@m-market-app/models';
import type { ICRUDService } from '../../../utils';

export interface IFoodComponentService extends Omit<ICRUDService<FoodComponentDT, FoodComponentDTN>, 'createMany' | 'update' | 'updateMany'> {
  getByFoodId(foodId: number): Promise<FoodComponentDT[]>;
  create(foodComponentDTN: FoodComponentDTN): Promise<FoodComponentDT>;
  update(foodComponentDT: FoodComponentDT, foodId: number): Promise<FoodComponentDT>;
  createMany(foodComponentDTNs: FoodComponentDTN[]): Promise<FoodComponentDT[]>;
  rewriteAllForOneFood(updFoodComponents: FoodComponentDTN[], foodId: number): Promise<FoodComponentDT[]>;
  removeMany(ids: number[]): Promise<void>;
  removeAllForOneFood(foodId: number): Promise<void>;
}