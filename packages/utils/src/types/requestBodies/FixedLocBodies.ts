import type { FixedLocDT } from '../../models/FixedLoc.js';
import type { EditLocString, NewLocString } from '../../models/LocString.js';
import { isFixedLocDT } from '../../models/FixedLoc.js';
import { isNewLocString, isEditLocString } from '../../models/LocString.js';
import { checkProperties, isString } from '../typeValidators.js';

export type NewFixedLocBody = Omit<FixedLocDT, 'id' | 'locString'>
& {
  locString: NewLocString;
};

export const isNewFixedLocBody = (obj: unknown): obj is NewFixedLocBody => {

  if (!checkProperties({ obj, properties: [
    'name', 'namespace', 'scope'
  ], required: true, validator: isString })) return false;

  if (!checkProperties({ obj, properties: [
    'locString'
  ], required: true, validator: isNewLocString })) return false;

  return true;
};


export type EditFixedLocBody = Omit<NewFixedLocBody, 'locString'>
& {
  locString: EditLocString;
};
  
export const isEditFixedLocBody = (obj: unknown): obj is EditFixedLocBody => {

  if (!checkProperties({ obj, properties: [
    'name', 'namespace', 'scope'
  ], required: true, validator: isString })) return false;

  if (!checkProperties({ obj, properties: [
    'locString'
  ], required: true, validator: isEditLocString })) return false;

  return true;
};


export type EditManyFixedLocBody = {
  updLocs: Array<FixedLocDT>
};
  
export const isEditManyFixedLocBody = (obj: unknown): obj is EditManyFixedLocBody => {

  if (!checkProperties({ obj, properties: [
    'updLocs'
  ], required: true, validator: isFixedLocDT })) return false;

  return true;
};