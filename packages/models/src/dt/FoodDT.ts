import type { MapToDT, MapToDTN, PropertyGroup } from '@m-cafe-app/utils';
import type { LocStringDT, LocStringDTN } from './LocStringDT.js';
import type { FoodTypeDT } from './FoodTypeDT.js';
import type { FoodPictureDT } from './FoodPictureDT.js';
import type { FoodComponentDT } from './FoodComponentDT.js';
import type { Food, FoodS } from '../domain';
import { isEntity, isNumber } from '@m-cafe-app/utils';
import { isFoodTypeDT } from './FoodTypeDT.js';
import { isFoodComponentDT } from './FoodComponentDT.js';
import { isPictureDT } from './PictureDT.js';
import {
  descriptionLocProperty,
  descriptionLocNewProperty,
  idRequired,
  nameLocProperty,
  nameLocNewProperty
} from './validationHelpers.js';


const foodPropertiesGroups: PropertyGroup[] = [{
  properties: ['foodType'],
  validator: isFoodTypeDT
}, {
  properties: ['foodCompoents'],
  required: false,
  validator: isFoodComponentDT,
  isArray: true
}, {
  properties: ['mainPicture'],
  required: false,
  validator: isPictureDT
}, {
  properties: ['gallery'],
  required: false,
  validator: isPictureDT,
  isArray: true
}, {
  properties: ['price'],
  validator: isNumber
}];

export type FoodDT = Omit<MapToDT<Food>, 'nameLoc' | 'descriptionLoc' | 'foodType' | 'foodComponents' | 'mainPicture' | 'gallery'> & {
  nameLoc: LocStringDT;
  descriptionLoc: LocStringDT;
  foodType: FoodTypeDT;
  foodComponents?: FoodComponentDT[];
  mainPicture?: FoodPictureDT;
  gallery?: FoodPictureDT[];
};

export const isFoodDT = (obj: unknown): obj is FoodDT =>
  isEntity(obj, [ idRequired, nameLocProperty, descriptionLocProperty, ...foodPropertiesGroups ]);




const foodNewPropertiesGroup: PropertyGroup = {
  properties: ['foodTypeId', 'price'],
  validator: isNumber
};

/**
 * New food transit data includes only new locales and foodType id
 */
export type FoodDTN = Omit<MapToDTN<Food>, 'nameLoc' | 'descriptionLoc' | 'foodType' | 'foodComponents' | 'mainPicture' | 'gallery'> & {
  nameLoc: LocStringDTN;
  descriptionLoc: LocStringDTN;
  foodTypeId: number;
};

export const isFoodDTN = (obj: unknown): obj is FoodDTN =>
  isEntity(obj, [ nameLocNewProperty, descriptionLocNewProperty, foodNewPropertiesGroup ]);



/**
 * Simple food data includes only id and name locale
 */
export type FoodDTS = Omit<MapToDT<FoodS>, 'nameLoc'> & {
  nameLoc: LocStringDT;
};

export const isFoodDTS = (obj: unknown): obj is FoodDTS =>
  isEntity(obj, [ idRequired, nameLocProperty ]);