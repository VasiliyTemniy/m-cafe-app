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

export const isBoolean = (bool: unknown, optional: boolean = false): bool is boolean => {
  if (optional) if (bool === null || bool === undefined) return true;
  return typeof bool === 'boolean' || bool instanceof Boolean;
};

export const isString = (text: unknown, optional: boolean = false): text is string => {
  if (optional) if (text === null || text === undefined) return true;
  return typeof text === 'string' || text instanceof String;
};

export const isNumber = (num: unknown, optional: boolean = false): num is number => {
  if (optional) if (num === null || num === undefined) return true;
  return typeof num === 'number' || num instanceof Number;
};

export const isDate = (date: unknown, optional: boolean = false): boolean => {
  if (optional) if (date === null || date === undefined) return true;
  if (date instanceof Date) return true;
  if (!isString(date)) return false;
  return Boolean(Date.parse(date));
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

export const isUnknownObject = (obj: unknown): obj is UnknownObject => {
  if (!obj) return false;
  return typeof obj === 'object' && obj !== null;
};

type UnknownArray = unknown[];

export const isUnknownArray = (arr: unknown): arr is UnknownArray => {
  if (!arr) return false;
  return Array.isArray(arr) && arr !== null;
};

interface CheckPropertiesArgs {
  obj: UnknownObject;
  properties: string[];
  required: boolean;
  validator: (value: unknown, optional?: boolean) => boolean;
  isArray?: boolean;
}

/**
 * Checks if an object has the specified properties and validates their values.\
 * Also counts the number of checked properties.
 *
 * @param {UnknownObject} obj - The object to be checked.
 * @param {string[]} properties - The properties to check for.
 * @param {boolean} required - Indicates if the properties are required.
 * @param {Function} validator - The function used to validate the property values.
 * @param {boolean} isArray - Indicates if the property values should be arrays.
 * @return returns { result: boolean, checkedCount: number }
 */
export const checkProperties = ({
  obj,
  properties,
  required,
  validator,
  isArray = false
}: CheckPropertiesArgs): { result: boolean, checkedCount: number } => {

  let checkedCount = 0;

  if (required && !isArray) {
    if (!hasOwnProperties(obj, properties)) return { result: false, checkedCount };
    for (const property of properties) {
      if (!validator(obj[property])) return { result: false, checkedCount };
      checkedCount++;
    }
  } else if (required && isArray) {
    if (!hasOwnProperties(obj, properties)) return { result: false, checkedCount };
    for (const property of properties) {
      if (!Array.isArray(obj[property])) return { result: false, checkedCount };
      const arr = obj[property] as Array<unknown>;
      for (const item of arr) {
        if (!validator(item)) return { result: false, checkedCount };
      }
      checkedCount++;
    }
  } else if (!required && !isArray) {
    for (const property of properties) {
      if (!hasOwnProperty(obj, property)) continue;
      if (!validator(obj[property], true)) return { result: false, checkedCount };
      checkedCount++;
    }
  } else if (!required && isArray) {
    for (const property of properties) {
      if (!hasOwnProperty(obj, property)) continue;
      if (!Array.isArray(obj[property])) return { result: false, checkedCount };
      const arr = obj[property] as Array<unknown>;
      for (const item of arr) {
        if (!validator(item, true)) return { result: false, checkedCount };
      }
      checkedCount++;
    }
  }
  return { result: true, checkedCount };
};


/**
 * Represents a group of properties to be validated.
 * 
 * By default, properties are required and are not arrays.
 */
export interface PropertyGroup {
  properties: string[];
  required?: boolean;
  validator: (value: unknown, optional?: boolean) => boolean;
  isArray?: boolean;
}

/**
 * Checks if the given object is an entity by validating its properties against the provided PropertyGroups.
 * By default, properties are required and are not arrays.\
 * If the object has more properties than those checked in validation process, then this object is suspicious.
 * The function does not throw an Error in this case, though.
 *
 * @param {unknown} obj - The object to be checked.
 * @param {PropertyGroup[]} propertiesGroups - An array of PropertyGroups containing the properties, validators, and other configurations.
 * @return {boolean} Returns true if the object is an entity, otherwise false.
 */
export const isEntity = <T>(obj: unknown, propertiesGroups: PropertyGroup[]): obj is T => {
  if (!isUnknownObject(obj)) return false;
  let totalCheckedCount = 0;
  for (const propertyGroup of propertiesGroups) {
    const { properties, required = true, validator, isArray = false } = propertyGroup;
    const { result, checkedCount } = checkProperties({
      obj,
      properties,
      required,
      validator,
      isArray
    });
    if (!result) return false;
    totalCheckedCount += checkedCount;
  }
  // obj cannot have less properties than those already checked;
  // If totalCheckedCount is more than quantity of object keys, than this object is suspicious
  // Suggestion: throw an error here?
  if (totalCheckedCount !== Object.keys(obj).length) return false;
  return true;
};

export const isManyEntity = <T>(obj: unknown, validator: (value: unknown) => boolean): obj is T[] => {
  if (!isUnknownArray(obj)) return false;
  for (const item of obj) {
    if (!validator(item)) return false;
  }
  return true;
};


export const isEnum = <T extends { [s: string]: unknown }>(value: unknown, enumObj: T): value is T[keyof T] => {
  return Object.values(enumObj).includes(value as T[keyof T]);
};