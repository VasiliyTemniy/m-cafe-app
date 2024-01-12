import type { FoodType, FoodTypeDTN, LocString } from '@m-market-app/models';
import type { GenericTransaction, ICRUDRepo } from '../../../utils';


export interface IFoodTypeRepo extends Omit<ICRUDRepo<FoodType, FoodTypeDTN>, 'getAll' | 'update'> {
  getAll(withFoodOnly: boolean): Promise<FoodType[]>;
  create(
    foodTypeDTN: FoodTypeDTN,
    nameLoc: LocString,
    descriptionLoc: LocString,
    transaction?: GenericTransaction
  ): Promise<FoodType>;
}