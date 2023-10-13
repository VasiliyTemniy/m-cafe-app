import type { MapToDT } from '../types/helpers.js';
import type { DynamicModuleData } from '@m-cafe-app/db';
import type { LocStringDT } from './LocString.js';
import type { PictureDT } from './Picture.js';
import { checkProperties, isNumber, isString } from '../types/typeValidators.js';
import { isLocStringDT } from './LocString.js';
import { isPictureDT } from './Picture.js';


export type DynamicModuleDT = Omit<MapToDT<DynamicModuleData>, 'locStringId' | 'pictureId'>
& {
  locString?: LocStringDT;
  picture?: PictureDT;
};

export const isDynamicModuleDT = (obj: unknown): obj is DynamicModuleDT => {

  if (!checkProperties({ obj, properties: [
    'id', 'moduleType', 'page', 'placementType'
  ], required: true, validator: isString })) return false;

  if (!checkProperties({ obj, properties: [
    'placement'
  ], required: true, validator: isNumber })) return false;

  if (!checkProperties({ obj, properties: [
    'className', 'inlineCss', 'url'
  ], required: false, validator: isString })) return false;

  if (!checkProperties({ obj, properties: [
    'locString'
  ], required: false, validator: isLocStringDT })) return false;

  if (!checkProperties({ obj, properties: [
    'picture'
  ], required: false, validator: isPictureDT })) return false;

  return true;
};