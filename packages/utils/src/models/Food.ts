import type { MapToDT } from '../types/helpers.js';
import type { FoodData } from '@m-cafe-app/db';
import type { LocStringDT } from './LocString.js';
import type { FoodTypeDT } from './FoodType.js';
import type { FoodComponentDT } from './FoodComponent.js';
import type { PictureDT } from './Picture.js';
import { checkProperties, isNumber } from '../types/typeValidators.js';
import { isLocStringDT } from './LocString.js';
import { isFoodTypeDT } from './FoodType.js';
import { isFoodComponentDT } from './FoodComponent.js';
import { isPictureDT } from './Picture.js';


export type FoodDT = Omit<MapToDT<FoodData>, 'nameLocId' | 'descriptionLocId' | 'foodTypeId'>
& {
  nameLoc: LocStringDT;
  descriptionLoc: LocStringDT;
  foodType: FoodTypeDT;
  foodComponents?: FoodComponentDT[];
  mainPicture?: PictureDT;
  gallery?: PictureDT[];
};

export const isFoodDT = (obj: unknown): obj is FoodDT => {

  if (!checkProperties({obj, properties: [
    'id', 'price'
  ], required: true, validator: isNumber})) return false;

  if (!checkProperties({obj, properties: [
    'nameLoc', 'descriptionLoc'
  ], required: true, validator: isLocStringDT})) return false;

  if (!checkProperties({obj, properties: [
    'foodType'
  ], required: true, validator: isFoodTypeDT})) return false;

  if (!checkProperties({obj, properties: [
    'foodComponents'
  ], required: false, validator: isFoodComponentDT, isArray: true})) return false;

  if (!checkProperties({obj, properties: [
    'mainPicture'
  ], required: false, validator: isPictureDT})) return false;

  if (!checkProperties({obj, properties: [
    'gallery'
  ], required: false, validator: isPictureDT, isArray: true})) return false;

  return true;
};

export type FoodDTS = Omit<MapToDT<FoodData>, 'nameLocId' | 'descriptionLocId' | 'foodTypeId' | 'price'>
  & {
    nameLoc: LocStringDT;
  };

export const isFoodDTS = (obj: unknown): obj is FoodDTS =>{

  if (!checkProperties({obj, properties: [
    'id'
  ], required: true, validator: isNumber})) return false;

  if (!checkProperties({obj, properties: [
    'nameLoc'
  ], required: true, validator: isLocStringDT})) return false;

  return true;
};