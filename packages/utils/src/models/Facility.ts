import type { MapToUnknown, MapToDT } from '../types/helpers.js';
import type { FacilityData } from '@m-cafe-app/db';
import type { LocStringDT } from './LocString.js';
import type { AddressDT } from './Address.js';
import type { UserDT } from './User.js';
import type { StockDT } from './Stock.js';
import { isNumber } from '../types/typeParsers.js';
import { hasOwnProperty } from '../types/helpers.js';
import { isLocStringDT } from './LocString.js';
import { isAddressDT } from './Address.js';
import { isUserDT } from './User.js';
import { isStockDT } from './Stock.js';


export type FacilityDT = Omit<MapToDT<FacilityData>, 'nameLocId' | 'descriptionLocId' | 'addressId'>
& {
  nameLoc: LocStringDT;
  descriptionLoc: LocStringDT;
  address: AddressDT;
  managers?: UserDT[];
  stocks?: StockDT[];
};

type FacilityDTFields = MapToUnknown<FacilityDT>;

const hasFacilityDTFields = (obj: unknown): obj is FacilityDTFields =>
  hasOwnProperty(obj, 'id')
  &&
  hasOwnProperty(obj, 'nameLoc')
  &&
  hasOwnProperty(obj, 'descriptionLoc')
  &&
  hasOwnProperty(obj, 'address');

export const isFacilityDT = (obj: unknown): obj is FacilityDT => {
  if (!hasFacilityDTFields(obj)) return false;

  if (obj.managers) {
    if (!Array.isArray(obj.managers)) return false;
    for (const manager of obj.managers)
      if (!isUserDT(manager)) return false;
  }

  if (obj.stocks) {
    if (!Array.isArray(obj.stocks)) return false;
    for (const stock of obj.stocks)
      if (!isStockDT(stock)) return false;
  }

  return isNumber(obj.id)
  &&
  isLocStringDT(obj.nameLoc)
  &&
  isLocStringDT(obj.descriptionLoc)
  &&
  isAddressDT(obj.address);
};



export type FacilityDTS = Omit<FacilityDT, 'descriptionLoc' | 'address' | 'managers' | 'stocks'>
& {
  nameLoc: LocStringDT;
};

type FacilityDTSFields = MapToUnknown<FacilityDTS>;

const hasFacilityDTSFields = (obj: unknown): obj is FacilityDTSFields =>
  hasOwnProperty(obj, 'id')
  &&
  hasOwnProperty(obj, 'nameLoc');

export const isFacilityDTS = (obj: unknown): obj is FacilityDTS =>
  hasFacilityDTSFields(obj)
  &&
  isNumber(obj.id)
  &&
  isLocStringDT(obj.nameLoc);