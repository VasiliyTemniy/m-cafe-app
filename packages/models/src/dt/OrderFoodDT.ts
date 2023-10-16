import type { MapToDT, PropertyGroup } from '@m-cafe-app/utils';
import type { OrderFood, OrderFoodS } from '../domain';
import type { FoodDTS } from './FoodDT.js';
import { isEntity, isNumber, isString } from '@m-cafe-app/utils';
import { isFoodDTS } from './FoodDT.js';
import { idRequired } from './validationHelpers.js';


const orderFoodPropertiesGroups: PropertyGroup[] = [{
  properties: ['food'],
  required: false,
  validator: isFoodDTS
}, {
  properties: ['amount', 'archivePrice'],
  validator: isNumber
}, {
  properties: ['archiveFoodName'],
  validator: isString
}];

const hasOrderIdProperty: PropertyGroup = {
  properties: ['orderId'],
  validator: isNumber
};

export type OrderFoodDT = Omit<MapToDT<OrderFood>, 'food'> & {
  food?: FoodDTS;
};

export const isOrderFoodDT = (obj: unknown): obj is OrderFoodDT =>
  isEntity(obj, [ idRequired, hasOrderIdProperty, ...orderFoodPropertiesGroups ]);



/**
 * Archive price and archive food name are applied on backend
 * New OrderFood contains only foodId and amount
 */
export type OrderFoodDTN = Omit<MapToDT<OrderFood>, 'id' | 'archivePrice' | 'archiveFoodName' | 'food'> & {
  foodId: number;
};

export const isOrderFoodDTN = (obj: unknown): obj is OrderFoodDTN =>
  isEntity(obj, [{
    properties: ['foodId', 'amount'],
    validator: isNumber
  }]);


/**
 * Contains id, foodId and amount to update exsisting OrderFood record
 */
export type OrderFoodDTU = Omit<MapToDT<OrderFood>, 'archivePrice' | 'archiveFoodName' | 'food'> & {
  foodId: number;
};

export const isOrderFoodDTU = (obj: unknown): obj is OrderFoodDTN =>
  isEntity(obj, [ idRequired, {
    properties: ['foodId', 'amount'],
    validator: isNumber
  }]);


/**
 * Simple version of OrderFood must be included in Order
 */
export type OrderFoodDTS = Omit<MapToDT<OrderFoodS>, 'food'> & {
  food?: FoodDTS;
};

export const isOrderFoodDTS = (obj: unknown): obj is OrderFoodDTS =>
  isEntity(obj, [ idRequired, ...orderFoodPropertiesGroups ]);