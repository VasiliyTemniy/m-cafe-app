import type { MapToDT, MapToDTN, PropertyGroup } from '@m-cafe-app/utils';
import type { Stock, StockS } from '../domain';
import { isEntity, isNumber } from '@m-cafe-app/utils';
import { idRequired } from './validationHelpers.js';


const stockPropertiesGroup: PropertyGroup = {
  properties: ['ingredientId', 'facilityId', 'amount'],
  validator: isNumber,
};


/**
 * Represents connection between ingredient and its amount in
 * particular facility
 */
export type StockDT = MapToDT<Stock>;

export const isStockDT = (obj: unknown): obj is StockDT =>
  isEntity(obj, [ idRequired, stockPropertiesGroup ]);


export type StockDTN = MapToDTN<Stock>;

export const isStockDTN = (obj: unknown): obj is StockDTN =>
  isEntity(obj, [ stockPropertiesGroup ]);


const stockSimplePropertiesGroup: PropertyGroup = {
  properties: ['id', 'ingredientId', 'amount'],
  validator: isNumber,
};


/**
 * Has info about ingredient and amount, not about facility \
 * Should be included in facility info
 */
export type StockDTS = MapToDT<StockS>;

export const isStockDTS = (obj: unknown): obj is StockDTS =>
  isEntity(obj, [ stockSimplePropertiesGroup ]);