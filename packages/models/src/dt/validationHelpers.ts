import type { PropertyGroup } from '@m-cafe-app/utils';
import { isNumber, isString } from '@m-cafe-app/utils';
import { isLocStringDT, isLocStringDTN, isLocStringDTS } from './LocStringDT';

export const idRequired: PropertyGroup = {
  properties: ['id'],
  validator: isNumber,
};

export const idOptional: PropertyGroup = {
  properties: ['id'],
  required: false,
  validator: isNumber,
};

export const passwordRequired: PropertyGroup = {
  properties: ['password'],
  validator: isString,
};

export const idPasswordOptional: PropertyGroup = {
  properties: ['id', 'password'],
  required: false,
  validator: isString,
};

export const locStringProperty: PropertyGroup = {
  properties: ['locString'],
  validator: isLocStringDT,
};

export const locStringNewProperty: PropertyGroup = {
  properties: ['locString'],
  validator: isLocStringDTN,
};

export const locStringSimpleProperty: PropertyGroup = {
  properties: ['locString'],
  validator: isLocStringDTS,
};