export enum SizingEnum {
  Mm = 0,
  Cm = 1,
  M = 2,
  Km = 3,
  Inch = 4,
  Foot = 5,
  Yard = 6,
  Mile = 7,
}

export const isSizingEnum = (type: unknown): type is SizingEnum =>
  (typeof type === 'number' || typeof type === 'string') && (type in SizingEnum);


export enum VolumeEnum {
  L = 0,
  Ml = 1,
  Cm3 = 2,
  M3 = 3,
  FluidOunce = 4,
  Gill = 5,
  Pint = 6,
  Quart = 7,
  Gallon = 8,
}

export const isVolumeEnum = (type: unknown): type is VolumeEnum =>
  (typeof type === 'number' || typeof type === 'string') && (type in VolumeEnum);


export enum MassEnum {
  G = 0,
  Kg = 1,
  T = 2,
  Ounce = 3,
  Pound = 4,
  Stone = 5,
  Quarter = 6,
  Hundredweight = 7,
  Tonne = 8,
}

export const isMassEnum = (type: unknown): type is MassEnum =>
  (typeof type === 'number' || typeof type === 'string') && (type in MassEnum);