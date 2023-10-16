import type { MapToDT, PropertyGroup } from '@m-cafe-app/utils';
import type { Picture } from '../domain';
import type { LocStringDT } from './LocStringDT';
import { isLocStringDT } from './LocStringDT.js';
import { isString, isEntity, checkProperties } from '@m-cafe-app/utils';
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


/**
 * This data transit new is not connected with PictureDT because picture file is
 * sent via multipart/form-data, so all body fields are pure text fields
 */
export type PictureDTN = {
  type: 'foodPicture' | 'modulePicture',
  orderNumber?: string,
  altTextMainStr: string,
  altTextSecStr?: string,
  altTextAltStr?: string,
  subjectId: string
};

export const isPictureDTN = (obj: unknown): obj is PictureDTN => {

  if (!checkProperties({ obj, properties: [
    'altTextMainStr', 'subjectId', 'type'
  ], required: true, validator: isString })) return false;

  if (!checkProperties({ obj, properties: [
    'altTextSecStr', 'altTextAltStr'
  ], required: false, validator: isString })) return false;

  if (!checkProperties({ obj, properties: [
    'orderNumber'
  ], required: false, validator: (value) => !isNaN(Number(value)) })) return false;

  return true;
};