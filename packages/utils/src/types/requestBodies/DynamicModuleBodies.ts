import type { DynamicModuleDT } from '../../models/DynamicModule.js';
import type { EditLocString, NewLocString } from '../../models/LocString.js';
import { isEditLocString, isNewLocString } from '../../models/LocString.js';
import { checkProperties, isNumber, isString } from '../typeValidators.js';

export type NewDynamicModuleBody = Omit<DynamicModuleDT, 'id' | 'locString' | 'picture' | 'placementType'>
& {
  locString?: NewLocString;
  placementType?: string;
};

export const isNewDynamicModuleBody = (obj: unknown): obj is NewDynamicModuleBody => {

  if (!checkProperties({ obj, properties: [
    'moduleType', 'page'
  ], required: true, validator: isString })) return false;

  if (!checkProperties({ obj, properties: [
    'placement'
  ], required: true, validator: isNumber })) return false;

  if (!checkProperties({ obj, properties: [
    'locString'
  ], required: false, validator: isNewLocString })) return false;

  if (!checkProperties({ obj, properties: [
    'placementType', 'className', 'inlineCss', 'url'
  ], required: false, validator: isString })) return false;

  return true;
};


export type EditDynamicModuleBody = Omit<NewDynamicModuleBody, 'locString'>
& {
  locString?: EditLocString;
};

export const isEditDynamicModuleBody = (obj: unknown): obj is EditDynamicModuleBody => {
  
  if (!checkProperties({ obj, properties: [
    'moduleType', 'page'
  ], required: true, validator: isString })) return false;

  if (!checkProperties({ obj, properties: [
    'placement'
  ], required: true, validator: isNumber })) return false;

  if (!checkProperties({ obj, properties: [
    'locString'
  ], required: false, validator: isEditLocString })) return false;

  if (!checkProperties({ obj, properties: [
    'placementType', 'className', 'inlineCss', 'url'
  ], required: false, validator: isString })) return false;

  return true;
};