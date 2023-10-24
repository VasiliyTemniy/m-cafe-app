import type { FoodType, FoodTypeDTN } from '@m-cafe-app/models';
import type { ICRUDRepo } from '../../../utils';


export interface IFoodTypeRepo extends ICRUDRepo<FoodType, FoodTypeDTN> {
}