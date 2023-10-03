import type { MapToDT, MapToDTNU } from '@m-cafe-app/utils';
import type { UiSetting } from '../domain';
import {
  idOptional,
  idRequired,
  isEntity,
  isManyEntity,
  isString
} from '@m-cafe-app/utils';


const uiSettingPropertiesGroup = {
  properties: ['name', 'group', 'theme', 'value'],
  required: true,
  validator: isString,
  isArray: false  
};


export type UiSettingDT = MapToDT<UiSetting>;

export const isUiSettingDT = (obj: unknown): obj is UiSettingDT =>
  isEntity(obj, [idRequired, uiSettingPropertiesGroup]);


export const isUiSettingDTMany = (obj: unknown): obj is UiSettingDT[] =>
  isManyEntity(obj, isUiSettingDT);



export type UiSettingDTNU = MapToDTNU<UiSetting>;

export const isUiSettingDTNU = (obj: unknown): obj is UiSettingDTNU =>
  isEntity(obj, [idOptional, uiSettingPropertiesGroup]);

export const isUiSettingDTNUMany = (obj: unknown): obj is UiSettingDTNU[] =>
  isManyEntity(obj, isUiSettingDTNU);