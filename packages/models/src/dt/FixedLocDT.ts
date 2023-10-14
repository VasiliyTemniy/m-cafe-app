import type { MapToDT, MapToDTN, PropertyGroup } from '@m-cafe-app/utils'; 
import type { FixedLoc, FixedLocS } from '../domain';
import type { LocStringDTN, LocStringDT, LocStringDTS } from './LocStringDT';
import { isEntity, isString } from '@m-cafe-app/utils';
import { idRequired, locStringProperty, locStringSimpleProperty, locStringNewProperty } from './validationHelpers';


const fixedLocPropertiesGroup: PropertyGroup = {
  properties: ['name', 'namespace', 'scope'],
  validator: isString,
};


export type FixedLocDT = Omit<MapToDT<FixedLoc>, 'locString'> & {
  locString: LocStringDT;
};

export const isFixedLocDT = (obj: unknown): obj is FixedLocDT =>
  isEntity(obj, [ idRequired, fixedLocPropertiesGroup, locStringProperty ]);


export type FixedLocDTS = Omit<MapToDT<FixedLocS>, 'locString'> & {
  locString: LocStringDTS;
};

export const isFixedLocDTS = (obj: unknown): obj is FixedLocDTS =>
  isEntity(obj, [ fixedLocPropertiesGroup, locStringSimpleProperty ]);


export type FixedLocDTN = Omit<MapToDTN<FixedLoc>, 'locString'> & {
  locString: LocStringDTN;
};

export const isFixedLocDTN = (obj: unknown): obj is FixedLocDTN =>
  isEntity(obj, [ fixedLocPropertiesGroup, locStringNewProperty ]);