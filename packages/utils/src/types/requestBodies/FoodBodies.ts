import type { EditLocString, NewLocString } from '../../models/LocString.js';
import type { FoodDT } from '../../models/Food.js';
import { isEditLocString, isNewLocString } from '../../models/LocString.js';
import { checkProperties, isNumber } from '../typeValidators.js';

export type NewFoodBody = Omit<FoodDT, 'id' | 'nameLoc' | 'descriptionLoc' | 'foodType'>
& {
  nameLoc: NewLocString;
  descriptionLoc: NewLocString;
  foodTypeId: number;
};

export const isNewFoodBody = (obj: unknown): obj is NewFoodBody => {

  if (!checkProperties({ obj, properties: [
    'nameLoc', 'descriptionLoc'
  ], required: true, validator: isNewLocString })) return false;

  if (!checkProperties({ obj, properties: [
    'price', 'foodTypeId'
  ], required: true, validator: isNumber })) return false;

  return true;
};

export type EditFoodBody = Omit<NewFoodBody, 'nameLoc' | 'descriptionLoc'>
  & {
    nameLoc: EditLocString;
    descriptionLoc: EditLocString;
  };
    
export const isEditFoodBody = (obj: unknown): obj is EditFoodBody => {

  if (!checkProperties({ obj, properties: [
    'nameLoc', 'descriptionLoc'
  ], required: true, validator: isEditLocString })) return false;

  if (!checkProperties({ obj, properties: [
    'price', 'foodTypeId'
  ], required: true, validator: isNumber })) return false;

  return true;
};