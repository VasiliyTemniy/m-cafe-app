import type { PropertyGroup } from '@m-cafe-app/utils';
import { isNumber, isString } from '@m-cafe-app/utils';
import { isLocStringDT, isLocStringDTN, isLocStringDTS } from './LocStringDT.js';

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

export const locStringOptionalProperty: PropertyGroup = {
  properties: ['locString'],
  required: false,
  validator: isLocStringDT,
};

export const locStringNewProperty: PropertyGroup = {
  properties: ['locString'],
  validator: isLocStringDTN,
};

export const locStringNewOptionalProperty: PropertyGroup = {
  properties: ['locString'],
  required: false,
  validator: isLocStringDTN,
};

export const locStringSimpleProperty: PropertyGroup = {
  properties: ['locString'],
  validator: isLocStringDTS,
};

export const nameLocProperty: PropertyGroup = {
  properties: ['nameLoc'],
  validator: isLocStringDT,
};

export const nameLocNewProperty: PropertyGroup = {
  properties: ['nameLoc'],
  validator: isLocStringDTN,
};

export const descriptionLocProperty: PropertyGroup = {
  properties: ['descriptionLoc'],
  validator: isLocStringDT,
};

export const descriptionLocNewProperty: PropertyGroup = {
  properties: ['descriptionLoc'],
  validator: isLocStringDTN,
};

export const stockMeasureLocProperty: PropertyGroup = {
  properties: ['stockMeasureLoc'],
  validator: isLocStringDT,
};

export const stockMeasureLocNewProperty: PropertyGroup = {
  properties: ['stockMeasureLoc'],
  validator: isLocStringDTN,
};