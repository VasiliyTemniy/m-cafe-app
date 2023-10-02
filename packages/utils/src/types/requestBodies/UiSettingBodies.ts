import type { UiSettingDT } from '../../models/UiSetting.js';
import { isUiSettingDT } from '../../models/UiSetting.js';
import { checkProperties, isString } from '../typeValidators.js';

export type NewUiSettingBody = Omit<UiSettingDT, 'id'>;

export const isNewUiSettingBody = (obj: unknown): obj is NewUiSettingBody => {

  if (!checkProperties({obj: obj, properties: [
    'name', 'value', 'group', 'theme'
  ], required: true, validator: isString})) return false;

  return true;
};


export type EditUiSettingBody = NewUiSettingBody;
  
export const isEditUiSettingBody = (obj: unknown): obj is EditUiSettingBody => {
  
  if (!checkProperties({obj, properties: [
    'name', 'value', 'group', 'theme'
  ], required: true, validator: isString})) return false;

  return true;
};


export type EditManyUiSettingBody = {
  updUiSettings: Array<UiSettingDT>
};
  
export const isEditManyUiSettingBody = (obj: unknown): obj is EditManyUiSettingBody => {

  if (!checkProperties({obj, properties: [
    'updUiSettings'
  ], required: true, validator: isUiSettingDT, isArray: true})) return false;

  return true;
};