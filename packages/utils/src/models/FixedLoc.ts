import type { MapToUnknown, MapToDT } from '../types/helpers.js';
import type { FixedLocData } from '@m-cafe-app/db';
import type { LocStringDT } from './LocString.js';
import { isNumber, isString } from '../types/typeParsers.js';
import { hasOwnProperty } from '../types/helpers.js';
import { isLocStringDT } from './LocString.js';


export type FixedLocDT = Omit<MapToDT<FixedLocData>, 'locStringId'>
& {
  locString: LocStringDT;
};

type FixedLocDTFields = MapToUnknown<FixedLocDT>;

const hasFixedLocDTFields = (obj: unknown): obj is FixedLocDTFields =>
  hasOwnProperty(obj, 'id') && hasOwnProperty(obj, 'name') && hasOwnProperty(obj, 'locString');

export const isFixedLocDT = (obj: unknown): obj is FixedLocDT =>
  hasFixedLocDTFields(obj) && isNumber(obj.id) && isString(obj.name) && isLocStringDT(obj.locString);