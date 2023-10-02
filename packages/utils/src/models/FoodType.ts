import type { MapToDT } from '../types/helpers.js';
import type { FoodTypeData } from '@m-cafe-app/db';
import type { LocStringDT } from './LocString.js';
import { checkProperties, isNumber } from '../types/typeValidators.js';
import { isLocStringDT } from './LocString.js';


export type FoodTypeDT = Omit<MapToDT<FoodTypeData>, 'nameLocId' | 'descriptionLocId'>
& {
  nameLoc: LocStringDT;
  descriptionLoc: LocStringDT;
};

export const isFoodTypeDT = (obj: unknown): obj is FoodTypeDT => {

  if (!checkProperties({obj, properties: [
    'id'
  ], required: true, validator: isNumber})) return false;

  if (!checkProperties({obj, properties: [
    'nameLoc', 'descriptionLoc'
  ], required: true, validator: isLocStringDT})) return false;

  return true;
};