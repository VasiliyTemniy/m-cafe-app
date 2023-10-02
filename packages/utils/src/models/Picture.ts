import type { MapToDT } from '../types/helpers.js';
import type { PictureData } from '@m-cafe-app/db';
import type { LocStringDT } from './LocString.js';
import { checkProperties, isNumber, isString } from '../types/typeValidators.js';
import { isLocStringDT } from './LocString.js';


export type PictureDT = Omit<MapToDT<PictureData>, 'altTextLocId'>
& {
  altTextLoc: LocStringDT;
};

export const isPictureDT = (obj: unknown): obj is PictureDT => {

  if (!checkProperties({obj, properties: [
    'id'
  ], required: true, validator: isNumber})) return false;

  if (!checkProperties({obj, properties: [
    'src'
  ], required: true, validator: isString})) return false;

  if (!checkProperties({obj, properties: [
    'altTextLoc'
  ], required: true, validator: isLocStringDT})) return false;

  return true;
};