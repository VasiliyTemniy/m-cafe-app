import type { IngredientDT } from '../../models/Ingredient.js';
import type { EditLocString, NewLocString } from '../../models/LocString.js';
import { isEditLocString, isNewLocString } from '../../models/LocString.js';
import { checkProperties, isNumber } from '../typeValidators.js';

export type NewIngredientBody = Omit<IngredientDT, 'id' | 'nameLoc' | 'stockMeasureLoc'>
& {
  nameLoc: NewLocString;
  stockMeasureLoc: NewLocString;
};

export const isNewIngredientBody = (obj: unknown): obj is NewIngredientBody => {

  if (!checkProperties({obj, properties: [
    'nameLoc', 'stockMeasureLoc'
  ], required: true, validator: isNewLocString})) return false;

  if (!checkProperties({obj, properties: [
    'proteins', 'fats', 'carbohydrates', 'calories'
  ], required: false, validator: isNumber})) return false;

  return true;
};


export type EditIngredientBody = Omit<NewIngredientBody, 'nameLoc' | 'stockMeasureLoc'>
& {
  nameLoc: EditLocString;
  stockMeasureLoc: EditLocString;
};
  
export const isEditIngredientBody = (obj: unknown): obj is EditIngredientBody => {

  if (!checkProperties({obj, properties: [
    'nameLoc', 'stockMeasureLoc'
  ], required: true, validator: isEditLocString})) return false;

  if (!checkProperties({obj, properties: [
    'proteins', 'fats', 'carbohydrates', 'calories'
  ], required: false, validator: isNumber})) return false;

  return true;
};