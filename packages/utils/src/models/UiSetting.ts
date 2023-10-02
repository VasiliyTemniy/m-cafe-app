import type { MapToDT } from '../types/helpers.js';
import type { UiSettingData } from '@m-cafe-app/db';
import { checkProperties, isNumber, isString } from '../types/typeValidators.js';


export type UiSettingDT = MapToDT<UiSettingData>;

export const isUiSettingDT = (obj: unknown): obj is UiSettingDT => {

  if (!checkProperties({obj, properties: [
    'id'
  ], required: true, validator: isNumber})) return false;

  if (!checkProperties({obj, properties: [
    'name', 'group', 'theme', 'value'
  ], required: true, validator: isString})) return false;

  return true;
};