import type { MapToDT } from '../types/helpers.js';
import type { OrderFoodData } from '@m-cafe-app/db';
import type { FoodDTS } from './Food.js';
import { checkProperties, isNumber, isString } from '../types/typeValidators.js';
import { isFoodDTS } from './Food.js';


export type OrderFoodDT = Omit<MapToDT<OrderFoodData>, 'foodId' | 'orderId'>
& {
  food?: FoodDTS;
};

export const isOrderFoodDT = (obj: unknown): obj is OrderFoodDT => {

  if (!checkProperties({ obj, properties: [
    'id', 'amount', 'archivePrice'
  ], required: true, validator: isNumber })) return false;

  if (!checkProperties({ obj, properties: [
    'archiveFoodName'
  ], required: true, validator: isString })) return false;

  if (!checkProperties({ obj, properties: [
    'food'
  ], required: false, validator: isFoodDTS })) return false;
  
  return true;
};