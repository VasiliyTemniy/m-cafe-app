import { ApplicationError, RedisError } from "./Errors.js";
import { isBoolean, isDate, isNumber, isString } from "./typeParsers.js";

export type MapToUnknown<T> = {
  [Property in keyof T]: unknown
};

export type MapToDT<T> = {
  [Property in keyof T]:
  T[Property] extends Date | undefined ? string :
  T[Property] extends Date ? string :
  T[Property] extends number ? number :
    // Maybe this will be useful later...
  // T[Property] extends ForeignKey<infer V> ? MapToDT<V> :
  T[Property]
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
 * Used only to map obj values to transit data.
 * Maps date obj to ISO strings, omits foreign keys, omits specified props.
 * For nested objects use separately for each layer
 */
export const mapDataToTransit = <T>(data: T, omitProps?: { omit?: string[]; omitTimestamps?: boolean }): MapToDT<T> => {
  const dataTransit = {} as MapToDT<T>;

  const omitFields =
    omitProps && omitProps.omit && omitProps.omitTimestamps ? [...timestampsKeys, ...omitProps.omit] :
    omitProps && omitProps.omitTimestamps ? [...timestampsKeys] :
    omitProps && omitProps.omit ? [...omitProps.omit] :
    [];

  for (const keyString in data) {

    const key = keyString as keyof T;
    if (!data[key]) if (!isNumber(data[key]) && !isBoolean(data[key])) continue;
    if (omitFields.includes(String(key))) continue;

    // Remove all foreign keys... In runtime only option is to check like this while all such keys must end up with 'Id'
    if (keyString.endsWith('Id')) continue;

    if (typeof data[key] === 'object')
      if (isDate(data[key])) {
        const date = data[key] as unknown as Date;
        dataTransit[key] = date.toISOString() as unknown as MapToDT<T>[keyof T];
        continue;
      } else {
        // For nested objects use destructuring and apply this func manually for every layer. Needed like this for sequelize model instances
        continue;
      }

    dataTransit[key] = data[key] as unknown as MapToDT<T>[keyof T];
  }

  return dataTransit;
};


/**
 * Used only to update db entry fields one by one for instance update
 */
export const updateInstance = <T>(oldInstance: T, newInstanceData: MapToDT<T>) => {
  for (const keyString in newInstanceData) {
    const key = keyString as keyof MapToDT<T>;

    if (typeof newInstanceData[key] === 'object') {
      if (isDate(newInstanceData[key])) {
        const date = newInstanceData[key] as unknown as string;
        oldInstance[key] = Date.parse(date) as unknown as T[keyof T];
        continue;
      } else {
        throw new ApplicationError('updateInstance function is used to update nested object! Check implementations');
      }
    }

    oldInstance[key] = newInstanceData[key] as unknown as T[keyof T];
  }
};

/**
 * Used only to map frontend form values from '' to undefined
 */
export const mapEmptyStringsToUndefined = <T>(data: T): T => {
  const mappedData = {} as T;

  for (const keyString in data) {
    const key = keyString as keyof T;

    const value = data[key];

    if (isString(value) && value === '') mappedData[key] = undefined as unknown as T[keyof T];
    else mappedData[key] = data[key];
  }

  return mappedData;
};