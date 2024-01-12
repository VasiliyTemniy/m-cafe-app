import type { FoodComponent, FoodComponentDTN, FoodS, IngredientS } from '@m-cafe-app/models';
import type { GenericTransaction, ICRUDRepo } from '../../../utils';


export interface IFoodComponentRepo extends Omit<ICRUDRepo<FoodComponent, FoodComponentDTN>, 'createMany' | 'update'> {
  getByFoodId(foodId: number): Promise<FoodComponent[]>;
  create(
    foodComponentDTN: FoodComponentDTN,
    usedComponentSimple: FoodS | IngredientS,
    transaction?: GenericTransaction
  ): Promise<FoodComponent>;
  createMany(foodComponentDTNs: FoodComponentDTN[], transaction: GenericTransaction): Promise<FoodComponent[]>;
  update(updFoodComponent: FoodComponent, foodId: number, transaction?: GenericTransaction): Promise<FoodComponent>;
  rewriteAllForOneFood(
    updFoodComponents: FoodComponentDTN[],
    foodId: number,
    transaction: GenericTransaction
  ): Promise<FoodComponent[]>;
  removeWithCount(ids: number[], transaction?: GenericTransaction): Promise<number>;
  removeAllForOneFood(foodId: number, transaction?: GenericTransaction): Promise<void>;
}