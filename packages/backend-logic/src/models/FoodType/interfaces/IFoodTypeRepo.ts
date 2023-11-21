import type { FoodType, FoodTypeDTN, LocString } from '@m-cafe-app/models';
import type { GenericTransaction, ICRUDRepo } from '../../../utils';


export interface IFoodTypeRepo extends Omit<ICRUDRepo<FoodType, FoodTypeDTN>, 'update'> {
  create(
    foodTypeDTN: FoodTypeDTN,
    nameLoc: LocString,
    descriptionLoc: LocString,
    transaction?: GenericTransaction
  ): Promise<FoodType>;
}