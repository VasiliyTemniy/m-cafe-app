import type { Loc, LocS } from '../domain';
import type { MapToDT, PropertyGroup } from '@m-market-app/utils';
import { isEntity, isNumber, isString } from '@m-market-app/utils';
import { isLocParentType, isLocType } from '@m-market-app/shared-constants';


/**
 * Contains languageId, parentId, parentType, locType, translation text and timestamps\
 * For internal service usage\
 * This DT is used for creating new Loc for another model existing record or updating existing Loc
 */
export type LocDT = MapToDT<Loc>;

const locDTPropertiesGroups: PropertyGroup[] = [{
  properties: ['languageId', 'parentId'],
  validator: isNumber,
}, {
  properties: ['parentType'],
  validator: isLocParentType,
}, {
  properties: ['locType'],
  validator: isLocType,
}, {
  properties: ['text'],
  validator: isString,
}];

export const isLocDT = (obj: unknown): obj is LocDT =>
  isEntity(obj, locDTPropertiesGroups);


/**
 * Contains only translation and languageCode, no ids or references
 */
export type LocDTS = MapToDT<LocS>;

const locDTSPropertiesGroups: PropertyGroup[] = [{
  properties: ['text, languageCode'],
  validator: isString
}];

export const isLocDTS = (obj: unknown): obj is LocDTS =>
  isEntity(obj, locDTSPropertiesGroups);


/**
 * Contains translation, languageCode and languageId for fast loc creation while included in another model's DTN
 */
export type LocDTN = LocDTS & {
  languageId: number;
};

const locDTNPropertiesGroups: PropertyGroup[] = [{
  properties: ['text, languageCode'],
  validator: isString
}, {
  properties: ['languageId'],
  validator: isNumber
}];

export const isLocDTN = (obj: unknown): obj is LocDTN =>
  isEntity(obj, locDTNPropertiesGroups);