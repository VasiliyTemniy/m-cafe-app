import type { LocString, LocStringS } from '../domain';
import type { MapToDT, MapToDTN, PropertyGroup } from '@m-cafe-app/utils';
import { isEntity, isString } from '@m-cafe-app/utils';
import { idRequired } from './validationHelpers';


const locStringPropertiesGroups: PropertyGroup[] = [{
  properties: ['mainStr'],
  validator: isString,
}, {
  properties: ['secStr', 'altStr'],
  required: false,
  validator: isString,
}];

export type LocStringDT = MapToDT<LocString>;

export const isLocStringDT = (obj: unknown): obj is LocStringDT =>
  isEntity(obj, [ idRequired, ...locStringPropertiesGroups ]);


export type LocStringDTS = MapToDT<LocStringS>;

export const isLocStringDTS = (obj: unknown): obj is LocStringDTS =>
  isEntity(obj, locStringPropertiesGroups);


export type LocStringDTN = MapToDTN<LocString>;

export const isLocStringDTN = (obj: unknown): obj is LocStringDTN =>
  isEntity(obj, locStringPropertiesGroups);