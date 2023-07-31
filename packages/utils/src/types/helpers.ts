export type MapToUnknown<T> = {
  [Property in keyof T]: unknown
};

export type MapToDT<T> = {
  [Property in keyof T]:
  T[Property] extends Date | undefined ? string
  : T[Property] extends Date ? string
  : T[Property]
};

export type PropertiesTimestamps = 'createdAt' | 'updatedAt' | 'deletedAt';
export type PropertiesCreationOptional = 'id' | PropertiesTimestamps;

export const hasOwnProperty = (obj: unknown, property: string) => Object.prototype.hasOwnProperty.call(obj, property);