import type { AddressDT } from '../../models/Address.js';
import { isString, checkProperties, isNumber } from '../typeValidators.js';

export type NewAddressBody = Omit<AddressDT, 'id'>;

export const isNewAddressBody = (obj: unknown): obj is NewAddressBody => {

  if (!checkProperties({obj, properties: [
    'city', 'street'
  ], required: true, validator: isString})) return false;

  if (!checkProperties({obj, properties: [
    'cityDistrict', 'region', 'regionDistrict', 'house', 'entrance', 'flat', 'entranceKey'
  ], required: false, validator: isString})) return false;

  if (!checkProperties({obj, properties: [
    'floor'
  ], required: false, validator: isNumber})) return false;

  return true;
};

export type EditAddressBody = NewAddressBody;

export const isEditAddressBody = (body: unknown): body is EditAddressBody =>
  isNewAddressBody(body);