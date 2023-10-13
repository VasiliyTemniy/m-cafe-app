import type { MapToDT } from '../types/helpers.js';
import type { LocStringData } from '@m-cafe-app/db';
import { checkProperties, isNumber, isString } from '../types/typeValidators.js';


export type LocStringDT = MapToDT<LocStringData>;

export const isLocStringDT = (obj: unknown): obj is LocStringDT => {

  if (!checkProperties({ obj, properties: [
    'id'
  ], required: true, validator: isNumber })) return false;

  if (!checkProperties({ obj, properties: [
    'mainStr'
  ], required: true, validator: isString })) return false;

  if (!checkProperties({ obj, properties: [
    'secStr', 'altStr'
  ], required: false, validator: isString })) return false;

  return true;
};

export type NewLocString = Omit<LocStringDT, 'id'>;

export const isNewLocString = (obj: unknown): obj is NewLocString => {

  if (!checkProperties({ obj, properties: [
    'mainStr'
  ], required: true, validator: isString })) return false;

  if (!checkProperties({ obj, properties: [
    'secStr', 'altStr'
  ], required: false, validator: isString })) return false;

  return true;
};

export type EditLocString = LocStringDT;

export const isEditLocString = (obj: unknown): obj is EditLocString =>
  isLocStringDT(obj);