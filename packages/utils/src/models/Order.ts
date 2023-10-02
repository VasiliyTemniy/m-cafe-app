import type { MapToDT } from '../types/helpers.js';
import type { OrderData } from '@m-cafe-app/db';
import type { UserDT } from './User.js';
import type { AddressDT } from './Address.js';
import type { OrderFoodDT } from './OrderFood.js';
import type { FacilityDTS } from './Facility.js';
import { checkProperties, isNumber, isString } from '../types/typeValidators.js';
import { isUserDT } from './User.js';
import { isAddressDT } from './Address.js';
import { isOrderFoodDT } from './OrderFood.js';
import { isFacilityDTS } from './Facility.js';


export type OrderDT = Omit<MapToDT<OrderData>, 'userId' | 'addressId' | 'facilityId'>
& {
  user?: UserDT;
  address?: AddressDT;
  orderFoods: OrderFoodDT[];
  facility: FacilityDTS;
};

export const isOrderDT = (obj: unknown): obj is OrderDT => {

  if (!checkProperties({obj, properties: [
    'id', 'totalCost'
  ], required: true, validator: isNumber})) return false;

  if (!checkProperties({obj, properties: [
    'deliverAt', 'status', 'archiveAddress', 'customerPhonenumber'
  ], required: true, validator: isString})) return false;

  if (!checkProperties({obj, properties: [
    'orderFoods'
  ], required: true, validator: isOrderFoodDT, isArray: true})) return false;

  if (!checkProperties({obj, properties: [
    'facility'
  ], required: true, validator: isFacilityDTS})) return false;

  if (!checkProperties({obj, properties: [
    'user'
  ], required: false, validator: isUserDT})) return false;

  if (!checkProperties({obj, properties: [
    'address'
  ], required: false, validator: isAddressDT})) return false;

  if (!checkProperties({obj, properties: [
    'customerName'
  ], required: false, validator: isString})) return false;

  return true;
};


export type OrderDTS = Omit<OrderDT, 'user' | 'orderFoods' | 'address' | 'facility'>
& {
  facilityId: number;
};

export const isOrderDTS = (obj: unknown): obj is OrderDTS => {

  if (!checkProperties({obj, properties: [
    'id', 'totalCost', 'facilityId'
  ], required: true, validator: isNumber})) return false;

  if (!checkProperties({obj, properties: [
    'deliverAt', 'status', 'archiveAddress', 'customerPhonenumber'
  ], required: true, validator: isString})) return false;

  if (!checkProperties({obj, properties: [
    'customerName'
  ], required: false, validator: isString})) return false;

  return true;
};