import type { NewOrderFood } from './OrderBodies.js';
import { checkProperties, isNumber } from '../typeValidators.js';


export type EditOrderFoodBody = NewOrderFood & { id: number };

export const isEditOrderFoodBody = (obj: unknown): obj is EditOrderFoodBody => {
  
  if (!checkProperties({ obj, properties: [
    'amount', 'foodId', 'id'
  ], required: true, validator: isNumber })) return false;

  return true;
};