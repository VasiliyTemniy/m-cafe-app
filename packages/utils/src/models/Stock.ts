import type { MapToUnknown, MapToDT } from '../types/helpers.js';
import type { StockData } from '@m-cafe-app/db';
import type { IngredientDT } from './Ingredient.js';
import { isNumber } from '../types/typeParsers.js';
import { hasOwnProperty } from '../types/helpers.js';
import { isIngredientDT } from './Ingredient.js';


export type StockDT = Omit<MapToDT<StockData>, 'ingredientId' | 'facilityId'>
& {
  ingredient?: IngredientDT;
  ingredientId?: number;
  facilityId?: number;
};

type StockDTFields = MapToUnknown<StockDT>;

const hasStockDTFields = (obj: unknown): obj is StockDTFields =>
  hasOwnProperty(obj, 'id')
  &&
  hasOwnProperty(obj, 'amount');

export const isStockDT = (obj: unknown): obj is StockDT => {
  if (!hasStockDTFields(obj)) return false;

  if (
    (hasOwnProperty(obj, 'ingredient') && !isIngredientDT(obj.ingredient))
    ||
    (hasOwnProperty(obj, 'ingredientId') && !isNumber(obj.ingredientId))
    ||
    (hasOwnProperty(obj, 'facilityId') && !isNumber(obj.facilityId))
  ) return false;

  return isNumber(obj.id) && isNumber(obj.amount);
};