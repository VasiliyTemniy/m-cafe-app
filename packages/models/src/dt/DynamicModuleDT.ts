import type { MapToDT, MapToDTN, PropertyGroup } from '@m-cafe-app/utils';
import type { DynamicModule } from '../domain';
import type { LocStringDT, LocStringDTN } from './LocStringDT.js';
import type { PictureDT } from './PictureDT.js';
import { isEntity, isNumber, isString } from '@m-cafe-app/utils';
import { isPictureDT } from './PictureDT.js';
import { idRequired, locStringOptionalProperty, locStringNewOptionalProperty } from './validationHelpers';


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


const hasPictureOptionalProperty: PropertyGroup = {
  properties: ['picture'],
  required: false,
  validator: isPictureDT
};


export type DynamicModuleDT = Omit<MapToDT<DynamicModule>, 'picture' | 'locString'> & {
  picture?: PictureDT;
  locString?: LocStringDT;
};

export const isDynamicModuleDT = (obj: unknown): obj is DynamicModuleDT =>
  isEntity(obj, [
    idRequired,
    locStringOptionalProperty,
    hasPictureOptionalProperty,
    ...dynamicModulePropertiesGroups
  ]);


export type DynamicModuleDTN = Omit<MapToDTN<DynamicModule>, 'picture' | 'locString'> & {
  // picture?: PictureForDynamicModuleDTN; // Add picture after dynamic module creation
  locString?: LocStringDTN;
};

export const isDynamicModuleDTN = (obj: unknown): obj is DynamicModuleDTN =>
  isEntity(obj, [ locStringNewOptionalProperty, ...dynamicModulePropertiesGroups ]);