import type { Language } from '../domain';
import type { PropertyGroup, MapToDT, MapToDTN } from '@m-cafe-app/utils';
import { isEntity, isNumber, isString } from '@m-cafe-app/utils';


export type LanguageDT = MapToDT<Language>;

const languageDTPropertiesGroups: PropertyGroup[] = [{
  properties: ['id'],
  validator: isNumber
}, {
  properties: ['name', 'code'],
  validator: isString
}];

export const isLanguageDT = (obj: unknown): obj is LanguageDT =>
  isEntity(obj, languageDTPropertiesGroups);


export type LanguageDTN = MapToDTN<Language>;

const languageDTNPropertiesGroups: PropertyGroup[] = [{
  properties: ['name', 'code'],
  validator: isString
}];

export const isLanguageDTN = (obj: unknown): obj is LanguageDTN =>
  isEntity(obj, languageDTNPropertiesGroups);