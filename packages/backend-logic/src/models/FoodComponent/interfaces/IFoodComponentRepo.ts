import type { FoodComponent, FoodComponentDTN } from '@m-cafe-app/models';
import type { ICRUDRepo } from '../../../utils';


export interface IFoodComponentRepo extends Omit<ICRUDRepo<FoodComponent, FoodComponentDTN>, 'createMany' | 'update'> {
  createMany(foodComponentDTNs: FoodComponentDTN[]): Promise<FoodComponent[]>
  update(updFoodComponent: FoodComponent, foodId: number): Promise<FoodComponent>
  rewriteAllForOneFood(updFoodComponents: FoodComponentDTN[], foodId: number): Promise<FoodComponent[]>
}