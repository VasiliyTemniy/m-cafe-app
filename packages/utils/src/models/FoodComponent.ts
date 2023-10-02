import type { MapToDT } from '../types/helpers.js';
import type { FoodComponentData } from '@m-cafe-app/db';
import type { IngredientDTS } from './Ingredient.js';
import type { FoodDTS } from './Food.js';
import { isNumber, isBoolean, checkProperties } from '../types/typeValidators.js';
import { isIngredientDTS } from './Ingredient.js';
import { isFoodDTS } from './Food.js';


export type FoodComponentDT = Omit<MapToDT<FoodComponentData>, 'foodId' | 'componentId'>
& {
  component: FoodDTS | IngredientDTS;
};

export const isFoodComponentDT = (obj: unknown): obj is FoodComponentDT =>{

  if (!checkProperties({obj, properties: [
    'id'
  ], required: true, validator: isNumber})) return false;

  if (!checkProperties({obj, properties: [
    'component'
  ], required: true, validator: isFoodDTS}))
    if
    (!checkProperties({obj, properties: [
      'component'
    ], required: true, validator: isIngredientDTS})) return false;

  if (!checkProperties({obj, properties: [
    'amount'
  ], required: true, validator: isNumber})) return false;

  if (!checkProperties({obj, properties: [
    'compositeFood'
  ], required: false, validator: isBoolean})) return false;

  return true;
};