import type { MapToDT, MapToDTN, PropertyGroup } from '@m-cafe-app/utils';
import type { LocStringDT, LocStringDTN } from './LocStringDT';
import type { Ingredient, IngredientS } from '../domain';
import { isEntity, isNumber } from '@m-cafe-app/utils';
import { idRequired, nameLocNewProperty, nameLocProperty, stockMeasureLocNewProperty, stockMeasureLocProperty } from './validationHelpers.js';

const ingredientPropertiesGroup: PropertyGroup = {
  properties: ['proteins', 'fats', 'carbohydrates', 'calories'],
  required: false,
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
export type IngredientDTS = Omit<MapToDT<IngredientS>, 'nameLoc'> & {
  nameLoc: LocStringDT;
};

export const isIngredientDTS = (obj: unknown): obj is IngredientDTS =>
  isEntity(obj, [ idRequired, nameLocProperty ]); // If needed, add ingredientPropertiesGroup here
  // isEntity(obj, [ idRequired, nameLocProperty, ingredientPropertiesGroup ]);