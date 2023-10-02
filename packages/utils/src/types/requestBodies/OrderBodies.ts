import type { OrderDT } from '../../models/Order.js';
import type { OrderFoodDT } from '../../models/OrderFood.js';
import type { NewAddressBody } from './AddressBodies.js';
import { isAddressDT } from '../../models/Address.js';
import { checkProperties, isNumber, isString } from '../typeValidators.js';
import { isNewAddressBody } from './AddressBodies.js';


export type NewOrderFood = Omit<OrderFoodDT, 'id' | 'archivePrice' | 'archiveFoodName' | 'food'>
& {
  foodId: number;
};

export const isNewOrderFood = (obj: unknown): obj is NewOrderFood => {

  if (!checkProperties({obj, properties: [
    'amount', 'foodId'
  ], required: true, validator: isNumber})) return false;

  return true;
};


export type NewOrderBody = Omit<OrderDT, 'id' | 'totalCost' | 'user' | 'orderFoods' | 'status' | 'archiveAddress' | 'facility'>
& {
  orderFoods: NewOrderFood[];
  newAddress?: NewAddressBody;
  facilityId: number;
};

export const isNewOrderBody = (obj: unknown): obj is NewOrderBody => {

  if (!checkProperties({obj, properties: [
    'orderFoods'
  ], required: true, validator: isNewOrderFood, isArray: true})) return false;

  if (!checkProperties({obj, properties: [
    'deliverAt', 'customerPhonenumber'
  ], required: true, validator: isString})) return false;

  if (!checkProperties({obj, properties: [
    'facilityId'
  ], required: true, validator: isNumber})) return false;

  if (!checkProperties({obj, properties: [
    'address'
  ], required: false, validator: isAddressDT}))
    if (!checkProperties({obj, properties: [
      'newAddress'
    ], required: false, validator: isNewAddressBody}))
      return false;

  if (!checkProperties({obj, properties: [
    'customerName'
  ], required: false, validator: isString})) return false;

  return true;
};


export type EditOrderBody = Omit<NewOrderBody, 'orderFoods'>
& {
  orderFoods: NewOrderFood[];
};

export const isEditOrderBody = (obj: unknown): obj is EditOrderBody => {

  
  if (!checkProperties({obj, properties: [
    'orderFoods'
  ], required: true, validator: isNewOrderFood, isArray: true})) return false;

  if (!checkProperties({obj, properties: [
    'deliverAt', 'customerPhonenumber'
  ], required: true, validator: isString})) return false;

  if (!checkProperties({obj, properties: [
    'facilityId'
  ], required: true, validator: isNumber})) return false;

  if (!checkProperties({obj, properties: [
    'address'
  ], required: false, validator: isAddressDT}))
    if (!checkProperties({obj, properties: [
      'newAddress'
    ], required: false, validator: isNewAddressBody}))
      return false;

  if (!checkProperties({obj, properties: [
    'customerName'
  ], required: false, validator: isString})) return false;

  return true;
};


export type EditOrderStatusBody = {
  status: string
};

export const isEditOrderStatusBody = (obj: unknown): obj is EditOrderStatusBody => {
  
  if (!checkProperties({obj, properties: [
    'status'
  ], required: true, validator: isString})) return false;

  return true;
};