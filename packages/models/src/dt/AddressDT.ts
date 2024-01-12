import type { MapToDT, MapToDTN, PropertyGroup } from '@m-cafe-app/utils';
import type { Address } from '../domain';
import { isEntity, isNumber, isString } from '@m-cafe-app/utils';


export type AddressDT = MapToDT<Address>;

const addressDTPropertiesGroups: PropertyGroup[] = [{
  properties: ['id'],
  validator: isNumber
}, {
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
    'regionDistrict',
    'postalCode',
  ],
  required: false,
  validator: isString,
}, {
  properties: ['floor'],
  required: false,
  validator: isNumber,
}];

export const isAddressDT = (obj: unknown): obj is AddressDT =>
  isEntity(obj, addressDTPropertiesGroups);


export type AddressDTN = MapToDTN<Address>;

const addressDTNPropertiesGroups: PropertyGroup[] = [{
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
    'regionDistrict',
    'postalCode',
  ],
  required: false,
  validator: isString,
}, {
  properties: ['floor'],
  required: false,
  validator: isNumber,
}];

export const isAddressDTN = (obj: unknown): obj is AddressDTN =>
  isEntity(obj, addressDTNPropertiesGroups);