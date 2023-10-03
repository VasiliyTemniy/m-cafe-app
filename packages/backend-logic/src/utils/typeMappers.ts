export type MapToUnknown<T> = {
  [Property in keyof T]: unknown
};

export type MapToDT<T> = {
  -readonly [Property in keyof T]:
  T[Property] extends Date | undefined ? string | undefined :
  T[Property] extends Date ? string :
  T[Property] extends number ? number :
  T[Property]
};

export type MapToDTNU<T> = Omit<MapToDT<T>, 'id'> & {
  id?: number
};

export type MapToStrings<T> = {
  [Property in keyof T]: string
};