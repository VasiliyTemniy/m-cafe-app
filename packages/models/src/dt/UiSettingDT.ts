import type { MapToDT, MapToDTN, PropertyGroup } from '@m-cafe-app/utils';
import type { UiSetting, UiSettingS } from '../domain';
import {
  isEntity,
  isString
} from '@m-cafe-app/utils';
import { idRequired } from './validationHelpers.js';


const uiSettingDTPropertiesGroup: PropertyGroup = {
  properties: ['name', 'group', 'theme', 'value'],
  validator: isString,
};


export type UiSettingDT = MapToDT<UiSetting>;

export const isUiSettingDT = (obj: unknown): obj is UiSettingDT =>
  isEntity(obj, [idRequired, uiSettingDTPropertiesGroup]);


export const isUiSettingDTMany = (obj: unknown): obj is UiSettingDT[] =>
  Array.isArray(obj) && obj.every(isUiSettingDT);



export type UiSettingDTS = MapToDT<UiSettingS>;

export const isUiSettingDTS = (obj: unknown): obj is UiSettingDTS =>
  isEntity(obj, [uiSettingDTPropertiesGroup]);

export const isUiSettingDTSMany = (obj: unknown): obj is UiSettingDTS[] =>
  Array.isArray(obj) && obj.every(isUiSettingDTS);



export type UiSettingDTN = MapToDTN<UiSetting>;

export const isUiSettingDTN = (obj: unknown): obj is UiSettingDTN =>
  isEntity(obj, [uiSettingDTPropertiesGroup]);