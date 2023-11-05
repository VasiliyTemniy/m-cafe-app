import type { Ingredient, IngredientDTN } from '@m-cafe-app/models';
import type { ICRUDRepo } from '../../../utils';


export interface IIngredientRepo extends ICRUDRepo<Ingredient, IngredientDTN> {
}