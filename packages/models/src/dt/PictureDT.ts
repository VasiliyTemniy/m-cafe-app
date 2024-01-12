import type { MapToDT, PropertyGroup } from '@m-market-app/utils';
import type { Picture } from '../domain';
import type { LocDTS } from './LocDT';
import { isLocDTS } from './LocDT.js';
import { isString, isEntity, checkProperties, isUnknownObject, isNumber } from '@m-market-app/utils';
import { PictureParentType, isPictureParentType } from '@m-market-app/shared-constants';


/**
 * Full data transit for Picture\
 * Use to update or retrieve unassociated data
 */
export type PictureDT = Omit<MapToDT<Picture>, 'altTextLocs'> & {
  altTextLocs: LocDTS[];
};

const pictureDTPropertiesGroups: PropertyGroup[] = [{
  properties: ['id', 'parentId', 'orderNumber'],
  validator: isNumber,
}, {
  properties: ['src'],
  validator: isString,
}, {
  properties: ['parentType'],
  validator: isPictureParentType,
}, {
  properties: ['altTextLocs'],
  validator: isLocDTS,
}];

export const isPictureDT = (obj: unknown): obj is PictureDT =>
  isEntity(obj, pictureDTPropertiesGroups);


/**
 * Simple data transit for Picture\
 * Included in other model's DTs
 */
export type PictureDTS = Omit<MapToDT<Picture>, 'altTextLocs'> & {
  altTextLocs: LocDTS[];
};

const pictureDTSPropertiesGroups: PropertyGroup[] = [{
  properties: ['orderNumber'],
  validator: isNumber,
}, {
  properties: ['src'],
  validator: isString,
}, {
  properties: ['altTextLocs'],
  validator: isLocDTS,
}];

export const isPictureDTS = (obj: unknown): obj is PictureDTS =>
  isEntity(obj, pictureDTSPropertiesGroups);


/**
 * Data transit for new Picture\
 * All fields are strings because of multipart form data to upload an image\
 * Add optional altTextLocs with LocController
 */
export type PictureDTN = {
  altText: string,
  languageId: string,
  parentId: string,
  parentType: PictureParentType,
  orderNumber: string
};

export const isPictureDTN = (obj: unknown): obj is PictureDTN => {

  if (!isUnknownObject(obj)) return false;

  if (!checkProperties({ obj, properties: [
    'altText', 'languageId', 'parentId', 'orderNumber'
  ], required: true, validator: isString })) return false;

  if (!isPictureParentType(obj.parentType)) return false;

  if (isNaN(Number(obj.orderNumber)) || isNaN(Number(obj.parentId)) || isNaN(Number(obj.languageId))) return false;

  return true;
};