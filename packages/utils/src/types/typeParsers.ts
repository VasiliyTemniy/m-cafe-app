import { ParseError } from "./Errors.js";

export const parseString = (str: unknown): string => {
  if (!str || !isString(str)) {
    return "";
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
    return JSON.parse("") as JSON;
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

export const isDate = (date: string): boolean => {
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