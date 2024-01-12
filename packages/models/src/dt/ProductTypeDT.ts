import type { ProductType } from '../domain';
import type { MapToDT, MapToDTN, PropertyGroup } from '@m-cafe-app/utils';
import type { LocDTN, LocDTS } from './LocDT.js';
import { isLocDTN, isLocDTS } from './LocDT.js';
import { isEntity, isNumber } from '@m-cafe-app/utils';


export type ProductTypeDT = Omit<MapToDT<ProductType>, 'nameLocs' | 'descriptionLocs'> & {
  nameLocs: LocDTS[];
  descriptionLocs: LocDTS[];
};

const productTypeDTPropertiesGroups: PropertyGroup[] = [{
  properties: ['id'],
  validator: isNumber
}, {
  properties: ['nameLocs', 'descriptionLocs'],
  validator: isLocDTS,
  isArray: true
}];

export const isProductTypeDT = (obj: unknown): obj is ProductTypeDT =>
  isEntity(obj, productTypeDTPropertiesGroups);


export type ProductTypeDTN = Omit<MapToDTN<ProductType>, 'nameLocs' | 'descriptionLocs'> & {
  nameLocs: LocDTN[];
  descriptionLocs: LocDTN[];
};

const productTypeDTNPropertiesGroups: PropertyGroup[] = [{
  properties: ['nameLocs', 'descriptionLocs'],
  validator: isLocDTN,
  isArray: true
}];

export const isProductTypeDTN = (obj: unknown): obj is ProductTypeDTN =>
  isEntity(obj, productTypeDTNPropertiesGroups);