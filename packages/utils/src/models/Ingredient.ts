import type { MapToDT } from '../types/helpers.js';
import type { IngredientData } from '@m-cafe-app/db';
import type { LocStringDT } from './LocString.js';
import { checkProperties, isNumber } from '../types/typeValidators.js';
import { isLocStringDT } from './LocString.js';


export type IngredientDT = Omit<MapToDT<IngredientData>, 'nameLocId' | 'stockMeasureLocId'>
& {
  nameLoc: LocStringDT;
  stockMeasureLoc: LocStringDT;
};

export const isIngredientDT = (obj: unknown): obj is IngredientDT => {

  if (!checkProperties({obj, properties: [
    'id'
  ], required: true, validator: isNumber})) return false;

  if (!checkProperties({obj, properties: [
    'nameLoc', 'stockMeasureLoc'
  ], required: true, validator: isLocStringDT})) return false;

  if (!checkProperties({obj, properties: [
    'proteins', 'fats', 'carbohydrates', 'calories'
  ], required: false, validator: isNumber})) return false;

  return true;
};


export type IngredientDTS = Omit<MapToDT<IngredientData>, 'nameLocId' | 'stockMeasureLocId'>
& {
  nameLoc: LocStringDT;
};

export const isIngredientDTS = (obj: unknown): obj is IngredientDTS => {

  if (!checkProperties({obj, properties: [
    'id'
  ], required: true, validator: isNumber})) return false;

  if (!checkProperties({obj, properties: [
    'nameLoc'
  ], required: true, validator: isLocStringDT})) return false;

  if (!checkProperties({obj, properties: [
    'proteins', 'fats', 'carbohydrates', 'calories'
  ], required: false, validator: isNumber})) return false;

  return true;
};