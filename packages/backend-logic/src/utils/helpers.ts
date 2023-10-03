import { isNumber } from '@m-cafe-app/utils';

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