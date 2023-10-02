import type { MapToDT } from '../types/helpers.js';
import type { FixedLocData } from '@m-cafe-app/db';
import type { LocStringDT } from './LocString.js';
import { checkProperties, isNumber, isString } from '../types/typeValidators.js';
import { isLocStringDT } from './LocString.js';


export type FixedLocDT = Omit<MapToDT<FixedLocData>, 'locStringId'>
& {
  locString: LocStringDT;
  scope?: string;
};

export const isFixedLocDT = (obj: unknown): obj is FixedLocDT => {

  if (!checkProperties({obj, properties: [
    'id'
  ], required: true, validator: isNumber})) return false;

  if (!checkProperties({obj, properties: [
    'name', 'namespace'
  ], required: true, validator: isString})) return false;

  if (!checkProperties({obj, properties: [
    'locString'
  ], required: true, validator: isLocStringDT})) return false;

  if (!checkProperties({obj, properties: [
    'scope'
  ], required: false, validator: isString})) return false;

  return true;
};