export type MapToUnknown<T> = {
  [Property in keyof T]: unknown
};

export type MapToFrontendData<T> = {
  [Property in keyof T]:
  T[Property] extends Date | undefined ? string
  : T[Property] extends Date ? string
  : T[Property]
};

export type PropertiesTimestamps = 'createdAt' | 'updatedAt';
export type PropertiesCreationOptional = 'id' | PropertiesTimestamps;