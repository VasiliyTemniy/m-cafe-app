import type { MapToDT, MapToDTN } from '@m-cafe-app/utils';
import type { UiSetting } from '../domain';
import {
  idOptional,
  idRequired,
  isEntity,
  isManyEntity,
  isString
} from '@m-cafe-app/utils';


const uiSettingDTPropertiesGroup = {
  properties: ['name', 'group', 'theme', 'value'],
  required: true,
  validator: isString,
  isArray: false  
};


export type UiSettingDT = MapToDT<UiSetting>;

export const isUiSettingDT = (obj: unknown): obj is UiSettingDT =>
  isEntity(obj, [idRequired, uiSettingDTPropertiesGroup]);


export const isUiSettingDTMany = (obj: unknown): obj is UiSettingDT[] =>
  isManyEntity(obj, isUiSettingDT);



export type UiSettingDTN = MapToDTN<UiSetting>;

export const isUiSettingDTN = (obj: unknown): obj is UiSettingDTN =>
  isEntity(obj, [idOptional, uiSettingDTPropertiesGroup]);

export const isUiSettingDTNMany = (obj: unknown): obj is UiSettingDTN[] =>
  isManyEntity(obj, isUiSettingDTN);