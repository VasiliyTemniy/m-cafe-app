import type { MapToDT } from '../types/helpers.js';
import type { FacilityData } from '@m-cafe-app/db';
import type { LocStringDT } from './LocString.js';
import type { AddressDT } from './Address.js';
import type { UserDT } from './User.js';
import type { StockDT } from './Stock.js';
import { checkProperties, isNumber } from '../types/typeValidators.js';
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

export const isFacilityDT = (obj: unknown): obj is FacilityDT => {

  if (!checkProperties({obj, properties: [
    'id'
  ], required: true, validator: isNumber})) return false;

  if (!checkProperties({obj, properties: [
    'nameLoc', 'descriptionLoc'
  ], required: true, validator: isLocStringDT})) return false;

  if (!checkProperties({obj, properties: [
    'address'
  ], required: true, validator: isAddressDT})) return false;

  if (!checkProperties({obj, properties: [
    'managers'
  ], required: false, validator: isUserDT, isArray: true})) return false;

  if (!checkProperties({obj, properties: [
    'stocks'
  ], required: false, validator: isStockDT, isArray: true})) return false;

  return true;
};



export type FacilityDTS = Omit<FacilityDT, 'descriptionLoc' | 'address' | 'managers' | 'stocks'>
& {
  nameLoc: LocStringDT;
};

export const isFacilityDTS = (obj: unknown): obj is FacilityDTS =>{
  if (!checkProperties({obj, properties: [
    'id'
  ], required: true, validator: isNumber})) return false;

  if (!checkProperties({obj, properties: [
    'nameLoc'
  ], required: true, validator: isLocStringDT})) return false;

  return true;
};