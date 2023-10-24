import type { MapToDT, MapToDTN } from '@m-cafe-app/utils';
import type { FoodType } from '../domain';
import type { LocStringDT, LocStringDTN } from './LocStringDT.js';
import { isEntity } from '@m-cafe-app/utils';
import {
  descriptionLocNewProperty,
  descriptionLocProperty,
  idRequired,
  nameLocNewProperty,
  nameLocProperty
} from './validationHelpers.js';


export type FoodTypeDT = Omit<MapToDT<FoodType>, 'nameLoc' | 'descriptionLoc'> & {
  nameLoc: LocStringDT;
  descriptionLoc: LocStringDT;
};

export const isFoodTypeDT = (obj: unknown): obj is FoodTypeDT =>
  isEntity(obj, [ idRequired, nameLocProperty, descriptionLocProperty ]);


export type FoodTypeDTN = Omit<MapToDTN<FoodType>, 'nameLoc' | 'descriptionLoc'> & {
  nameLoc: LocStringDTN;
  descriptionLoc: LocStringDTN;
};

export const isFoodTypeDTN = (obj: unknown): obj is FoodTypeDTN =>
  isEntity(obj, [ nameLocNewProperty, descriptionLocNewProperty ]);