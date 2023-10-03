import { isNumber } from './typeValidators.js';

export const idRequired = {
  properties: ['id'],
  required: true,
  validator: isNumber,
  isArray: false
};

export const idOptional = {
  properties: ['id'],
  required: false,
  validator: isNumber,
  isArray: false
};