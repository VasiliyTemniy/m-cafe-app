import type { FoodTypeDT } from '../../models/FoodType.js';
import type { EditLocString, NewLocString } from '../../models/LocString.js';
import { isEditLocString, isNewLocString } from '../../models/LocString.js';
import { checkProperties } from '../typeValidators.js';

export type NewFoodTypeBody = Omit<FoodTypeDT, 'id' | 'nameLoc' | 'descriptionLoc'>
& {
  nameLoc: NewLocString;
  descriptionLoc: NewLocString;
};

export const isNewFoodTypeBody = (obj: unknown): obj is NewFoodTypeBody => {
  
  if (!checkProperties({obj, properties: [
    'nameLoc', 'descriptionLoc'
  ], required: true, validator: isNewLocString})) return false;
  
  return true;
};


export type EditFoodTypeBody = Omit<NewFoodTypeBody, 'nameLoc' | 'descriptionLoc'>
& {
  nameLoc: EditLocString;
  descriptionLoc: EditLocString;
};
  
export const isEditFoodTypeBody = (obj: unknown): obj is EditFoodTypeBody => {
  
  if (!checkProperties({obj, properties: [
    'nameLoc', 'descriptionLoc'
  ], required: true, validator: isEditLocString})) return false;
  
  return true;
};