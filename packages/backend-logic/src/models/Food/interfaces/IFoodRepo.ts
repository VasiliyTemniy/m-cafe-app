import type { Food, FoodDTN } from '@m-cafe-app/models';
import type { ICRUDRepo } from '../../../utils';


export interface IFoodRepo extends ICRUDRepo<Food, FoodDTN> {
}