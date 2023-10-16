import type { MapToDT, MapToDTN, PropertyGroup } from '@m-cafe-app/utils';
import type { LocStringDT, LocStringDTN } from './LocStringDT';
import type { Ingredient } from '../domain';
import { isEntity, isNumber } from '@m-cafe-app/utils';
import { idRequired, nameLocNewProperty, nameLocProperty, stockMeasureLocNewProperty, stockMeasureLocProperty } from './validationHelpers.js';

const ingredientPropertiesGroup: PropertyGroup = {
  properties: ['proteins', 'fats', 'carbohydrates', 'calories'],
  validator: isNumber,
};

export type IngredientDT = Omit<MapToDT<Ingredient>, 'stockMeasureLoc' | 'nameLoc'> & {
  nameLoc: LocStringDT;
  stockMeasureLoc: LocStringDT;
};

export const isIngredientDT = (obj: unknown): obj is IngredientDT =>
  isEntity(obj, [ idRequired, nameLocProperty, stockMeasureLocProperty, ingredientPropertiesGroup ]);

  

export type IngredientDTN = Omit<MapToDTN<Ingredient>, 'stockMeasureLoc' | 'nameLoc'> & {
  nameLoc: LocStringDTN;
  stockMeasureLoc: LocStringDTN;
};

export const isIngredientDTN = (obj: unknown): obj is IngredientDTN =>
  isEntity(obj, [ nameLocNewProperty, stockMeasureLocNewProperty, ingredientPropertiesGroup ]);


/**
 * Simple Ingredient data to be included in foodComponent
 */
export type IngredientDTS = Omit<MapToDT<Ingredient>, 'stockMeasureLoc'>;

export const isIngredientDTS = (obj: unknown): obj is IngredientDTS =>
  isEntity(obj, [ nameLocProperty, ingredientPropertiesGroup ]); // If id is required, add it here