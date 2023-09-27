import type { MapToUnknown } from '../helpers.js';
import type { NewOrderFood } from './OrderBodies.js';
import { hasOwnProperty } from '../helpers.js';
import { isNumber } from '../typeParsers.js';


export type EditOrderFoodBody = NewOrderFood & { id: number };

type EditOrderFoodBodyFields = MapToUnknown<EditOrderFoodBody>;


const hasEditOrderFoodBodyFields = (body: unknown): body is EditOrderFoodBodyFields =>
  hasOwnProperty(body, 'amount')
  &&
  hasOwnProperty(body, 'foodId')
  &&
  hasOwnProperty(body, 'id');

export const isEditOrderFoodBody = (body: unknown): body is EditOrderFoodBody =>
  hasEditOrderFoodBodyFields(body)
  &&
  isNumber(body.amount)
  &&
  isNumber(body.foodId)
  &&
  isNumber(body.id);