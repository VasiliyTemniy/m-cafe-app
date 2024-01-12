import type { MapToDT, MapToDTN, PropertyGroup } from '@m-cafe-app/utils'; 
import type { FixedLoc, FixedLocS } from '../domain';
import type { LocDTS } from './LocDT.js';
import { isEntity, isNumber, isString } from '@m-cafe-app/utils';
import { isLocDTS } from './LocDT.js';


export type FixedLocDT = Omit<MapToDT<FixedLoc>, 'locs'> & {
  locs: LocDTS[];
};

const fixedLocDTPropertiesGroups: PropertyGroup[] = [{
  properties: ['id'],
  validator: isNumber,
}, {
  properties: ['name', 'namespace', 'scope'],
  validator: isString,
}, {
  properties: ['locs'],
  validator: isLocDTS,
  isArray: true
}];

export const isFixedLocDT = (obj: unknown): obj is FixedLocDT =>
  isEntity(obj, fixedLocDTPropertiesGroups);

export const isFixedLocDTMany = (obj: unknown): obj is FixedLocDT[] =>
  Array.isArray(obj) && obj.every(isFixedLocDT);
  

export type FixedLocDTS = Omit<MapToDT<FixedLocS>, 'locs'> & {
  locs: LocDTS[];
};

const fixedLocDTSPropertiesGroups: PropertyGroup[] = [{
  properties: ['name', 'namespace', 'scope'],
  validator: isString,
}, {
  properties: ['locs'],
  validator: isLocDTS,
  isArray: true
}];

export const isFixedLocDTS = (obj: unknown): obj is FixedLocDTS =>
  isEntity(obj, fixedLocDTSPropertiesGroups);


/**
 * Used only for initFixedLocs - no new fixed locs are allowed for anyone
 */
export type FixedLocDTN = Omit<MapToDTN<FixedLoc>, 'locs'>;

const fixedLocDTNPropertiesGroups: PropertyGroup[] = [{
  properties: ['name', 'namespace', 'scope'],
  validator: isString,
}];

export const isFixedLocDTN = (obj: unknown): obj is FixedLocDTN =>
  isEntity(obj, fixedLocDTNPropertiesGroups);