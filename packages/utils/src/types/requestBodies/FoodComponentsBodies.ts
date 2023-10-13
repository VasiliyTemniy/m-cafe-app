import type { FoodComponentDT } from '../../models/FoodComponent.js';
import { checkProperties, isBoolean, isNumber } from '../typeValidators.js';

export type NewFoodComponent = Omit<FoodComponentDT, 'id' | 'component'>
& {
  componentId: number;
};

export const isNewFoodComponent = (obj: unknown): obj is NewFoodComponent => {
  
  if (!checkProperties({ obj, properties: [
    'componentId', 'amount'
  ], required: true, validator: isNumber })) return false;

  if (!checkProperties({ obj, properties: [
    'compositeFood'
  ], required: true, validator: isBoolean })) return false;

  return true;
};


export type AddFoodComponentsBody = {
  foodComponents: NewFoodComponent[];
};

export const isAddFoodComponentsBody = (obj: unknown): obj is AddFoodComponentsBody => {

  if (!checkProperties({ obj, properties: [
    'foodComponents'
  ], required: true, validator: isNewFoodComponent, isArray: true })) return false;

  return true;
};


export type EditFoodComponentBody = NewFoodComponent;

export const isEditFoodComponentBody = (obj: unknown): obj is EditFoodComponentBody => 
  isNewFoodComponent(obj);