import type { Food, FoodDTN, FoodType, LocString } from '@m-cafe-app/models';
import type { GenericTransaction, ICRUDRepo } from '../../../utils';


export interface IFoodRepo extends ICRUDRepo<Food, FoodDTN> {
  getManySortedByIds(ids: number[]): Promise<Food[]>;
  getByIdWithComponents(id: number): Promise<Food>;
  create(
    foodDTN: FoodDTN,
    nameLoc: LocString,
    descriptionLoc: LocString,
    foodType: FoodType,
    transaction?: GenericTransaction
  ): Promise<Food>;
}