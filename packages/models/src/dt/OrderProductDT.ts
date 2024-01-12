import type { MapToDT, PropertyGroup } from '@m-market-app/utils';
import type { OrderFood } from '../domain';
import type { FoodDTS } from './FoodDT.js';
import { isEntity, isNumber, isString } from '@m-market-app/utils';
import { isFoodDTS } from './FoodDT.js';


const orderFoodPropertiesGroups: PropertyGroup[] = [{
  properties: ['food'],
  required: false,
  validator: isFoodDTS
}, {
  properties: ['quantity', 'archivePrice', 'archiveFoodId'],
  validator: isNumber
}, {
  properties: ['archiveFoodName'],
  validator: isString
}, {
  properties: ['orderId'],
  required: false,
  validator: isNumber
}];

/**
 * Order food has archivePrice and archiveFoodName to destinguish food even if it is deleted\
 * \
 * Optionally contains full food record if it exists in db; If price is changed - archivePrice is used\
 * \
 * FoodId and orderId are optional - they are used to update exsisting OrderFood record
 */
export type OrderFoodDT = Omit<MapToDT<OrderFood>, 'food'> & {
  food?: FoodDTS;
};

export const isOrderFoodDT = (obj: unknown): obj is OrderFoodDT =>
  isEntity(obj, orderFoodPropertiesGroups);


const newOrderFoodPropertiesGroups: PropertyGroup[] = [{
  properties: ['quantity'],
  validator: isNumber
}, {
  properties: ['foodId', 'orderId'],
  validator: isNumber
}];

/**
 * Archive price, archive food id and archive food name are applied on backend\
 * New OrderFood contains only foodId, orderId and quantity
 */
export type OrderFoodDTN = Omit<MapToDT<OrderFood>, 'archivePrice' | 'archiveFoodName' | 'archiveFoodId' | 'food'> & {
  orderId: number;
  foodId: number;
};

export const isOrderFoodDTN = (obj: unknown): obj is OrderFoodDTN =>
  isEntity(obj, newOrderFoodPropertiesGroups);