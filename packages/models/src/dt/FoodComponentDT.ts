import type { MapToDT, MapToDTN } from '@m-cafe-app/utils';
import type { FoodComponent } from '../domain';
import type { FoodDTS } from './FoodDT.js';
import type { IngredientDTS } from './IngredientDT.js';
import { isFoodDT } from './FoodDT.js';
import { isIngredientDTS } from './IngredientDT.js';
import { isUnknownObject, isNumber, isBoolean, isManyEntity } from '@m-cafe-app/utils';


export type FoodComponentDT = Omit<MapToDT<FoodComponent>, 'component'> & {
  component: FoodDTS | IngredientDTS;
};

export const isFoodComponentDT = (obj: unknown): obj is FoodComponentDT => {
  if (!isUnknownObject(obj)) return false;

  if (!isNumber(obj.id)) return false;

  if (!isBoolean(obj.compositeFood)) return false;

  if (obj.compositeFood && !isFoodDT(obj.component)) return false;
  if (!obj.compositeFood && !isIngredientDTS(obj.component)) return false;

  if (!isNumber(obj.amount)) return false;

  return true;
};



export type FoodComponentDTN = Omit<MapToDTN<FoodComponent>, 'component'> & {
  foodId: number;
  componentId: number;
};

export const isFoodComponentDTN = (obj: unknown): obj is FoodComponentDTN => {
  if (!isUnknownObject(obj)) return false;

  if (!isBoolean(obj.compositeFood)) return false;

  if (!isNumber(obj.componentId)) return false;
  if (!isNumber(obj.foodId)) return false;
  if (!isNumber(obj.amount)) return false;

  return true;
};


export const isFoodComponentDTNMany = (obj: unknown): obj is FoodComponentDTN[] =>
  isManyEntity(obj, isFoodComponentDTN);


export const isRewriteAllForOneFoodBody = (obj: unknown): obj is { foodId: number, components: FoodComponentDTN[] } => {
  if (!isUnknownObject(obj)) return false;

  if (!isNumber(obj.foodId)) return false;

  return isFoodComponentDTNMany(obj.components);
};