import type { Ingredient, IngredientDTN, LocString } from '@m-cafe-app/models';
import type { GenericTransaction, ICRUDRepo } from '../../../utils';


export interface IIngredientRepo extends ICRUDRepo<Ingredient, IngredientDTN> {
  create(
    ingredientDTN: IngredientDTN,
    nameLoc: LocString,
    stockMeasureLoc: LocString,
    transaction?: GenericTransaction
  ): Promise<Ingredient>;
}