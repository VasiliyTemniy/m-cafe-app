import { hasOwnProperties, hasOwnProperty } from './helpers.js';
import { ParseError } from './Errors.js';

export const parseString = (str: unknown): string => {
  if (!str || !isString(str)) {
    return '';
  }
  return str;
};

export const parseNumber = (num: unknown): number => {
  if (!num || !isNumber(num)) {
    return 0;
  }
  return num;
};

export const parseDate = (date: unknown): Date => {
  if (!date || !isString(date) || !isDate(date)) {
    throw new ParseError(`Incorrect or missing date: ${date}`);
  }
  return new Date(date);
};

export const parseBoolean = (bool: unknown): boolean => {
  if (!isBoolean(bool)) {
    return false;
  }
  return bool;
};

export const parseJSON = (strJson: unknown): JSON => {
  if (!strJson || !isJSON(strJson)) {
    return JSON.parse('') as JSON;
  }
  return strJson;
};

export const isBoolean = (bool: unknown): bool is boolean => {
  return typeof bool === 'boolean' || bool instanceof Boolean;
};

export const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String;
};

export const isNumber = (num: unknown): num is number => {
  return typeof num === 'number' || num instanceof Number;
};

export const isDate = (date: unknown): boolean => {
  return Boolean(Date.parse(date as string));
};

export const isJSON = (json: unknown): json is JSON => {
  return typeof json === 'string' || json instanceof String;
};

export const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

type UnknownObject = {
  [key: string]: unknown
};

const isUnknownObject = (obj: unknown): obj is UnknownObject => {
  if (!obj) return false;
  return typeof obj === 'object' && obj !== null;
};

interface CheckPropertiesArgs {
  obj: unknown;
  properties: string[];
  required: boolean;
  validator: (value: unknown) => boolean;
  isArray?: boolean;
}

/**
 * Checks if an object has the specified properties and validates their values.
 *
 * @param {Object} obj - The object to be checked.
 * @param {string[]} properties - The properties to check for.
 * @param {boolean} required - Indicates if the properties are required.
 * @param {Function} validator - The function used to validate the property values.
 * @param {boolean} isArray - Indicates if the property values should be arrays.
 * @return {boolean} Returns true if all properties are present and their values are valid, otherwise returns false.
 */
export const checkProperties = ({
  obj,
  properties,
  required,
  validator,
  isArray = false
}: CheckPropertiesArgs): boolean => {
  if (!isUnknownObject(obj)) return false;
  if (required && !isArray) {
    if (!hasOwnProperties(obj, properties)) return false;
    for (const property of properties) {
      if (!validator(obj[property])) return false;
    }
  } else if (required && isArray) {
    if (!hasOwnProperties(obj, properties)) return false;
    for (const property of properties) {
      if (!Array.isArray(obj[property])) return false;
      const arr = obj[property] as Array<unknown>;
      for (const item of arr)
        if (!validator(item)) return false;
    }
  } else if (!required && !isArray) {
    for (const property of properties) {
      if (!hasOwnProperty(obj, property)) continue;
      if (!validator(obj[property])) return false;
    }
  } else if (!required && isArray) {
    for (const property of properties) {
      if (!hasOwnProperty(obj, property)) continue;
      if (!Array.isArray(obj[property])) return false;
      const arr = obj[property] as Array<unknown>;
      for (const item of arr)
        if (!validator(item)) return false;
    }
  }
  return true;
};


interface PropertyGroup {
  properties: string[];
  required: boolean;
  validator: (value: unknown) => boolean;
  isArray: boolean;
}

export const isEntity = <T>(obj: unknown, propertiesGroups: PropertyGroup[]): obj is T => {
  if (!isUnknownObject(obj)) return false;
  for (const propertyGroup of propertiesGroups) {
    if (!checkProperties({
      obj,
      properties: propertyGroup.properties,
      required: propertyGroup.required,
      validator: propertyGroup.validator,
      isArray: propertyGroup.isArray
    })) return false;
  }
  return true;
};

export const isManyEntity = <T>(obj: unknown, validator: (value: unknown) => boolean): obj is T[] => {
  if (!isUnknownObject(obj)) return false;
  if (!Array.isArray(obj)) return false;
  for (const item of obj) {
    if (!validator(item)) return false;
  }
  return true;
};