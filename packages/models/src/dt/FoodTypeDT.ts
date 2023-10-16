import type { MapToDT, MapToDTN, PropertyGroup } from '@m-cafe-app/utils';
import type { FoodType } from '../domain';
import { isEntity } from '@m-cafe-app/utils';
import { isLocStringDT } from './LocStringDT.js';
import { idRequired } from './validationHelpers.js';


const foodTypePropertiesGroup: PropertyGroup = {
  properties: ['nameLoc', 'descriptionLoc'],
  validator: isLocStringDT,
};

export type FoodTypeDT = MapToDT<FoodType>;

export const isFoodTypeDT = (obj: unknown): obj is FoodTypeDT =>
  isEntity(obj, [ idRequired, foodTypePropertiesGroup ]);


export type FoodTypeDTN = MapToDTN<FoodType>;

export const isFoodTypeDTN = (obj: unknown): obj is FoodTypeDTN =>
  isEntity(obj, [ foodTypePropertiesGroup ]);