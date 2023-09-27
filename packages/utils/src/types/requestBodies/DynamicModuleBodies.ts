import type { MapToUnknown } from '../helpers.js';
import type { DynamicModuleDT } from '../../models/DynamicModule.js';
import type { EditLocString, NewLocString } from '../../models/LocString.js';
import { hasOwnProperty } from '../helpers.js';
import { isEditLocString, isNewLocString } from '../../models/LocString.js';
import { isNumber, isString } from '../typeParsers.js';

export type NewDynamicModuleBody = Omit<DynamicModuleDT, 'id' | 'locString' | 'picture' | 'placementType'>
& {
  locString?: NewLocString;
  placementType?: string;
};

type NewDynamicModuleBodyFields = MapToUnknown<NewDynamicModuleBody>;

const hasNewDynamicModuleBodyFields = (body: unknown): body is NewDynamicModuleBodyFields =>
  hasOwnProperty(body, 'moduleType')
  &&
  hasOwnProperty(body, 'page')
  &&
  hasOwnProperty(body, 'placement');

export const isNewDynamicModuleBody = (body: unknown): body is NewDynamicModuleBody => {
  if (!hasNewDynamicModuleBodyFields(body)) return false;

  if (
    (hasOwnProperty(body, 'className') && !isString(body.className))
    ||
    (hasOwnProperty(body, 'inlineCss') && !isString(body.inlineCss))
    ||
    (hasOwnProperty(body, 'url') && !isString(body.url))
    ||
    (hasOwnProperty(body, 'locString') && !isNewLocString(body.locString))
    ||
    (hasOwnProperty(body, 'placementType') && !isString(body.placementType))
  ) return false;
  
  return isString(body.moduleType)
  &&
  isString(body.page)
  &&
  isNumber(body.placement);
};


export type EditDynamicModuleBody = Omit<NewDynamicModuleBody, 'locString'>
& {
  locString?: EditLocString;
};

type EditDynamicModuleBodyFields = MapToUnknown<EditDynamicModuleBody>;

const hasEditDynamicModuleBodyFields = (body: unknown): body is EditDynamicModuleBodyFields =>
  hasNewDynamicModuleBodyFields(body);

export const isEditDynamicModuleBody = (body: unknown): body is EditDynamicModuleBody =>{
  if (!hasEditDynamicModuleBodyFields(body)) return false;

  if (
    (hasOwnProperty(body, 'className') && !isString(body.className))
    ||
    (hasOwnProperty(body, 'inlineCss') && !isString(body.inlineCss))
    ||
    (hasOwnProperty(body, 'url') && !isString(body.url))
    ||
    (hasOwnProperty(body, 'locString') && !isEditLocString(body.locString))
    ||
    (hasOwnProperty(body, 'placementType') && !isString(body.placementType))
  ) return false;
  
  return isString(body.moduleType)
  &&
  isString(body.page)
  &&
  isNumber(body.placement);
};