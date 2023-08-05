import { RedisError } from "./Errors.js";
import { isDate } from "./typeParsers.js";

export type MapToUnknown<T> = {
  [Property in keyof T]: unknown
};

export type MapToDT<T> = {
  [Property in keyof T]:
  T[Property] extends Date | undefined ? string
  : T[Property] extends Date ? string
  : T[Property]
};

export type MapToStrings<T> = {
  [Property in keyof T]: string
};

export const hasOwnProperty = (obj: unknown, property: string) => Object.prototype.hasOwnProperty.call(obj, property);


export const timestampsKeys = ['createdAt', 'updatedAt', 'deletedAt'];
export const creationOptionalKeys = ['id', ...timestampsKeys];


/**
 * Used only to map obj values to strings for Redis
 */
export const mapToRedisStrings = <T>(data: T, omitProps?: { omit: string[]; }): MapToStrings<T> => {
  const dataStrings = {} as MapToStrings<T>;

  for (const keyString in data) {

    const key = keyString as keyof T;
    if (!data[key]) continue;
    if (omitProps && omitProps.omit.includes(String(key))) continue;

    if (
      typeof data[key] === 'number'
      ||
      typeof data[key] === 'boolean'
      ||
      typeof data[key] === 'string'
    ) {
      dataStrings[key] = String(data[key]);
      continue;
    }

    if (typeof data[key] === 'object')
      if (isDate(data[key])) {
        const date = data[key] as unknown as Date;
        dataStrings[key] = date.toISOString();
        continue;
      } else {
        throw new RedisError('dataToStrings function is used to convert nested object! Check implementations');
      }
  }

  return dataStrings;
};


/**
 * Used only to map strings from Redis to data fields
 */
export const parseRedisToData = <T>(dataStrings: MapToStrings<T>): T => {
  const data = {} as T;
  for (const keyString in dataStrings) {

    const key = keyString as keyof T;

    if (!isNaN(Number(dataStrings[key]))) {
      data[key] = Number(dataStrings[key]) as unknown as T[keyof T];
      continue;
    }

    // Date regexp
    if (/^\d{4}(-\d\d(-\d\d(T\d\d:\d\d(:\d\d)?(\.\d+)?(([+-]\d\d:\d\d)|Z)?)?)?)?$/.test(dataStrings[key])) {
      data[key] = new Date(dataStrings[key]) as unknown as T[keyof T];
      continue;
    }

    if (dataStrings[key] === 'true' || dataStrings[key] === 'false') {
      data[key] = Boolean(dataStrings[key]) as unknown as T[keyof T];
      continue;
    }

    data[key] = dataStrings[key] as unknown as T[keyof T];
  }
  return data;
};


/**
 * Used only to map strings from Redis to transit data fields
 */
export const parseRedisToDT = <T>(dataObjStrings: MapToStrings<T>): T => {
  const dataTransit = {} as T;
  for (const keyString in dataObjStrings) {

    const key = keyString as keyof T;

    if (!isNaN(Number(dataObjStrings[key]))) {
      dataTransit[key] = Number(dataObjStrings[key]) as unknown as T[keyof T];
      continue;
    }

    if (dataObjStrings[key] === 'true' || dataObjStrings[key] === 'false') {
      dataTransit[key] = Boolean(dataObjStrings[key]) as unknown as T[keyof T];
      continue;
    }

    dataTransit[key] = dataObjStrings[key] as unknown as T[keyof T];
  }
  return dataTransit;
};


/**
 * Used only to map obj values to transit data
 */
export const mapDataToTransit = <T>(data: T, omitProps?: { omit: string[]; }): MapToDT<T> => {
  const dataTransit = {} as MapToDT<T>;

  const omitFields = omitProps ?
    [...timestampsKeys, ...omitProps.omit]
    : [...timestampsKeys];

  for (const keyString in data) {

    const key = keyString as keyof T;
    if (!data[key]) continue;
    if (omitFields.includes(String(key))) continue;

    if (typeof data[key] === 'object')
      if (isDate(data[key])) {
        const date = data[key] as unknown as Date;
        dataTransit[key] = date.toISOString() as unknown as MapToDT<T>[keyof T];
        continue;
      } else {
        dataTransit[key] = mapDataToTransit(data[key]) as unknown as MapToDT<T>[keyof T];
        continue;
      }

    dataTransit[key] = data[key] as unknown as MapToDT<T>[keyof T];
  }

  return dataTransit;
};