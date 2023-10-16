import type { MapToDT, MapToDTN, PropertyGroup } from '@m-cafe-app/utils';
import type { DynamicModule } from '../domain';
import type { LocStringDT, LocStringDTN } from './LocStringDT.js';
import type { PictureDT, PictureDTN } from './PictureDT.js';
import { isEntity, isNumber, isString } from '@m-cafe-app/utils';
import { isPictureDT } from './PictureDT.js';
import { idRequired, locStringProperty, locStringNewProperty } from './validationHelpers';


const dynamicModulePropertiesGroups: PropertyGroup[] = [{
  properties: ['moduleType', 'page', 'placementType'],
  validator: isString
}, {
  properties: ['placement'],
  validator: isNumber
}, {
  properties: ['className', 'inlineCss', 'url'],
  required: false,
  validator: isString
}];


const hasPictureProperty: PropertyGroup = {
  properties: ['picture'],
  required: false,
  validator: isPictureDT
};


export type DynamicModuleDT = Omit<MapToDT<DynamicModule>, 'picture' | 'locString'> & {
  picture?: PictureDT;
  locString?: LocStringDT;
};

export const isDynamicModuleDT = (obj: unknown): obj is DynamicModuleDT =>
  isEntity(obj, [ idRequired, locStringProperty, hasPictureProperty, ...dynamicModulePropertiesGroups ]);


export type DynamicModuleDTN = Omit<MapToDTN<DynamicModule>, 'picture' | 'locString'> & {
  picture?: PictureDTN;
  locString?: LocStringDTN;
};

export const isDynamicModuleDTN = (obj: unknown): obj is DynamicModuleDTN =>
  isEntity(obj, [ locStringNewProperty, ...dynamicModulePropertiesGroups ]);