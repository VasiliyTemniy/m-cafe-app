import type { MapToDT, MapToDTN, PropertyGroup } from '@m-cafe-app/utils';
import type { Address } from '../domain';
import { isEntity, isNumber, isString } from '@m-cafe-app/utils';
import { idRequired } from './validationHelpers.js';

const addressPropertiesGroups: PropertyGroup[] = [{
  properties: ['city', 'street'],
  validator: isString,
}, {
  properties: [
    'house',
    'entrance',
    'flat',
    'entranceKey',
    'cityDistrict',
    'region',
    'regionDistrict'
  ],
  required: false,
  validator: isString,
}, {
  properties: ['floor'],
  required: false,
  validator: isNumber,
}];

export type AddressDT = MapToDT<Address>;

export const isAddressDT = (obj: unknown): obj is AddressDT =>
  isEntity(obj, [ idRequired, ...addressPropertiesGroups ]);


export type AddressDTN = MapToDTN<Address>;

export const isAddressDTN = (obj: unknown): obj is AddressDTN =>
  isEntity(obj, addressPropertiesGroups);