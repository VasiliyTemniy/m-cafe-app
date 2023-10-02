import type { MapToDT } from '../types/helpers.js';
import type { StockData } from '@m-cafe-app/db';
import type { IngredientDT } from './Ingredient.js';
import { checkProperties, isNumber } from '../types/typeValidators.js';
import { isIngredientDT } from './Ingredient.js';


export type StockDT = Omit<MapToDT<StockData>, 'ingredientId' | 'facilityId'>
& {
  ingredient?: IngredientDT;
  ingredientId?: number;
  facilityId?: number;
};

export const isStockDT = (obj: unknown): obj is StockDT => {

  if (!checkProperties({obj, properties: [
    'id', 'amount'
  ], required: true, validator: isNumber})) return false;

  if (!checkProperties({obj, properties: [
    'ingredient'
  ], required: false, validator: isIngredientDT})) return false;

  if (!checkProperties({obj, properties: [
    'ingredientId', 'facilityId'
  ], required: false, validator: isNumber})) return false;

  return true;
};