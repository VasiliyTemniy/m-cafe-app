import type { MapToDT, MapToDTN, PropertyGroup } from '@m-cafe-app/utils'; 
import type { FixedLoc, FixedLocS } from '../domain';
import type { LocStringDT, LocStringDTS } from './LocStringDT';
import { isEntity, isString } from '@m-cafe-app/utils';
import { idRequired, locStringProperty, locStringSimpleProperty } from './validationHelpers.js';


const fixedLocPropertiesGroup: PropertyGroup = {
  properties: ['name', 'namespace', 'scope'],
  validator: isString,
};


export type FixedLocDT = Omit<MapToDT<FixedLoc>, 'locString'> & {
  locString: LocStringDT;
};

export const isFixedLocDT = (obj: unknown): obj is FixedLocDT =>
  isEntity(obj, [ idRequired, fixedLocPropertiesGroup, locStringProperty ]);

export const isFixedLocDTMany = (obj: unknown): obj is FixedLocDT[] =>
  Array.isArray(obj) && obj.every(isFixedLocDT);
  

export type FixedLocDTS = Omit<MapToDT<FixedLocS>, 'locString'> & {
  locString: LocStringDTS;
};

export const isFixedLocDTS = (obj: unknown): obj is FixedLocDTS =>
  isEntity(obj, [ fixedLocPropertiesGroup, locStringSimpleProperty ]);


// export type FixedLocDTN = Omit<MapToDTN<FixedLoc>, 'locString'> & {
//   locString: LocStringDTN;
// };

export type FixedLocDTN = Omit<MapToDTN<FixedLoc>, 'locString'>;

export const isFixedLocDTN = (obj: unknown): obj is FixedLocDTN =>
  isEntity(obj, [ fixedLocPropertiesGroup ]);