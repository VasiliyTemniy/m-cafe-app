import type { MapToDT, PropertyGroup } from '@m-cafe-app/utils';
import type { Picture } from '../domain';
import type { LocStringDT } from './LocStringDT';
import { isLocStringDT } from './LocStringDT.js';
import { isString, isEntity, checkProperties, isUnknownObject } from '@m-cafe-app/utils';
import { idRequired } from './validationHelpers';

const picturePropertiesGroups: PropertyGroup[] = [{
  properties: ['src'],
  validator: isString,
}, {
  properties: ['altTextLoc'],
  validator: isLocStringDT,
}];

export type PictureDT = Omit<MapToDT<Picture>, 'altTextLoc'> & {
  altTextLoc: LocStringDT;
};

export const isPictureDT = (obj: unknown): obj is PictureDT =>
  isEntity(obj, [ idRequired, ...picturePropertiesGroups ]);


export type PictureForFoodDTN = {
  altTextMainStr: string,
  altTextSecStr?: string,
  altTextAltStr?: string,
  foodId: string,
  orderNumber: string
};

export const isPictureForFoodDTN = (obj: unknown): obj is PictureForFoodDTN => {

  if (!isUnknownObject(obj)) return false;

  if (!checkProperties({ obj, properties: [
    'altTextMainStr', 'foodId', 'orderNumber'
  ], required: true, validator: isString })) return false;

  if (isNaN(Number(obj.orderNumber)) || isNaN(Number(obj.foodId))) return false;

  if (!checkProperties({ obj, properties: [
    'altTextSecStr', 'altTextAltStr'
  ], required: false, validator: isString })) return false;

  return true;
};


export type PictureForDynamicModuleDTN = {
  altTextMainStr: string,
  altTextSecStr?: string,
  altTextAltStr?: string,
  dynamicModuleId: string
};

export const isPictureForDynamicModuleDTN = (obj: unknown): obj is PictureForDynamicModuleDTN => {

  if (!isUnknownObject(obj)) return false;

  if (!checkProperties({ obj, properties: [
    'altTextMainStr', 'dynamicModuleId'
  ], required: true, validator: isString })) return false;

  if (isNaN(Number(obj.orderNumber)) || isNaN(Number(obj.foodId))) return false;

  if (!checkProperties({ obj, properties: [
    'altTextSecStr', 'altTextAltStr'
  ], required: false, validator: isString })) return false;

  return true;
};