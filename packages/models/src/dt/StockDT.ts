import type { MapToDT, MapToDTN, PropertyGroup } from '@m-market-app/utils';
import type { Stock, StockS } from '../domain';
import { isEntity, isNumber } from '@m-market-app/utils';
import { idRequired } from './validationHelpers.js';


const stockPropertiesGroup: PropertyGroup = {
  properties: ['ingredientId', 'facilityId', 'quantity'],
  validator: isNumber,
};


/**
 * Represents connection between ingredient and its quantity in
 * particular facility
 */
export type StockDT = MapToDT<Stock>;

export const isStockDT = (obj: unknown): obj is StockDT =>
  isEntity(obj, [ idRequired, stockPropertiesGroup ]);

export const isStockDTMany = (obj: unknown): obj is StockDT[] =>
  Array.isArray(obj) && obj.every(isStockDT);


export type StockDTN = MapToDTN<Stock>;

export const isStockDTN = (obj: unknown): obj is StockDTN =>
  isEntity(obj, [ stockPropertiesGroup ]);

export const isStockDTNMany = (obj: unknown): obj is StockDTN[] =>
  Array.isArray(obj) && obj.every(isStockDTN);


const stockSimplePropertiesGroup: PropertyGroup = {
  properties: ['id', 'ingredientId', 'quantity'],
  validator: isNumber,
};


/**
 * Has info about ingredient and quantity, not about facility \
 * Should be included in facility info
 */
export type StockDTS = MapToDT<StockS>;

export const isStockDTS = (obj: unknown): obj is StockDTS =>
  isEntity(obj, [ stockSimplePropertiesGroup ]);

export const isStockDTSMany = (obj: unknown): obj is StockDTS[] =>
  Array.isArray(obj) && obj.every(isStockDTS);