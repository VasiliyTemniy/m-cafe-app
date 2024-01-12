import type { MapToDT, MapToDTN, PropertyGroup } from '@m-cafe-app/utils';
import type { DynamicModule } from '../domain';
import type { LocDTN, LocDTS } from './LocDT.js';
import type { PictureDTS } from './PictureDT.js';
import { isLocDTN, isLocDTS } from './LocDT.js';
import { isEntity, isNumber, isString, isUnknownObject } from '@m-cafe-app/utils';
import { isPictureDTS } from './PictureDT.js';
import {
  isDynamicModulePageType,
  isDynamicModulePlacementType,
  isDynamicModulePreset,
  isDynamicModuleType
} from '@m-cafe-app/shared-constants';


export type DynamicModuleDT = Omit<MapToDT<DynamicModule>, 'pictures' | 'locs'> & {
  pictures?: PictureDTS[];
  locs?: LocDTS[];
};

const dynamicModuleDTPropertiesGroups: PropertyGroup[] = [{
  properties: ['moduleType'],
  validator: isDynamicModuleType
}, {
  properties: ['placementType'],
  validator: isDynamicModulePlacementType
}, {
  properties: ['pages'],
  validator: isDynamicModulePageType,
  isArray: true
}, {
  properties: ['id', 'placement', 'nestLevel'],
  validator: isNumber
}, {
  properties: ['preset'],
  required: false,
  validator: isDynamicModulePreset
}, {
  properties: ['locs'],
  required: false,
  validator: isLocDTS,
  isArray: true
}, {
  properties: ['className', 'inlineCss', 'url'],
  required: false,
  validator: isString
}, {
  properties: ['pictures'],
  required: false,
  validator: isPictureDTS,
  isArray: true
}];

export const isDynamicModuleDT = (obj: unknown): obj is DynamicModuleDT => {
  if (!isUnknownObject(obj)) return false;

  if (!isEntity(obj, dynamicModuleDTPropertiesGroups)) return false;
  if (obj.childDynamicModules) {
    if (!Array.isArray(obj.childDynamicModules)) return false;
    if (!obj.childDynamicModules.every(isDynamicModuleDT)) return false;
  }

  return true;
};


export type DynamicModuleDTN = Omit<MapToDTN<DynamicModule>, 'pictures' | 'locs'> & {
  // pictures?: PictureDTN; // Add pictures after dynamic module creation
  locs?: LocDTN[];
};

const dynamicModuleDTNPropertiesGroups: PropertyGroup[] = [{
  properties: ['moduleType'],
  validator: isDynamicModuleType
}, {
  properties: ['placementType'],
  validator: isDynamicModulePlacementType
}, {
  properties: ['pages'],
  validator: isDynamicModulePageType,
  isArray: true
}, {
  properties: ['placement', 'nestLevel'],
  validator: isNumber
}, {
  properties: ['preset'],
  required: false,
  validator: isDynamicModulePreset
}, {
  properties: ['locs'],
  required: false,
  validator: isLocDTN,
  isArray: true
}, {
  properties: ['className', 'inlineCss', 'url'],
  required: false,
  validator: isString
}];

export const isDynamicModuleDTN = (obj: unknown): obj is DynamicModuleDTN =>
  isEntity(obj, dynamicModuleDTNPropertiesGroups);