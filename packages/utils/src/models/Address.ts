import type { MapToDT } from '../types/helpers.js';
import type { AddressData } from '@m-cafe-app/db';
import { checkProperties, isNumber, isString } from '../types/typeValidators.js';

export type AddressDT = MapToDT<AddressData>;

export const isAddressDT = (obj: unknown): obj is AddressDT => {

  if (!checkProperties({obj, properties: [
    'id', 'city', 'street'
  ], required: true, validator: isString})) return false;

  if (!checkProperties({obj, properties: [
    'cityDistrict', 'region', 'regionDistrict', 'house', 'entrance', 'flat', 'entranceKey'
  ], required: false, validator: isString})) return false;

  if (!checkProperties({obj, properties: [
    'floor'
  ], required: false, validator: isNumber})) return false;

  return true;
};