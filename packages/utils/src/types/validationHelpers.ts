import { isNumber, isString } from './typeValidators.js';

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

export const passwordRequired = {
  properties: ['password'],
  required: true,
  validator: isString,
  isArray: false
};

export const idPasswordOptional = {
  properties: ['id', 'password'],
  required: false,
  validator: isString,
  isArray: false
};