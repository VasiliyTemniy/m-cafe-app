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

export const parseDate = (date: unknown): string => {
  if (!date || !isString(date) || !isDate(date)) {
    return "last";
    // throw new Error(`Incorrect or missing date`);
  }
  return date;
};

export const parseBoolean = (bool: unknown): boolean => {
  if (!isBoolean(bool)) {
    return false;
  }
  return bool;
};

export const parseJSON = (strJson: JSON) => {
  if (!strJson || !isJSON(strJson)) {
    return "";
  }
  return strJson;
};

const isBoolean = (bool: unknown): bool is boolean => {
  return typeof bool === 'boolean' || bool instanceof Boolean;
};

const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String;
};

const isNumber = (num: unknown): num is number => {
  return typeof num === 'number' || num instanceof Number;
};

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

const isJSON = (json: unknown): json is JSON => {
  return typeof json === 'string' || json instanceof String;
};

export const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};