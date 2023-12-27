export enum SizingEnum {
  Mm = 'mm',
  Cm = 'cm',
  M = 'm',
  Km = 'km',
  Inch = 'inch',
  Foot = 'foot',
  Yard = 'yard',
  Mile = 'mile',
}

export const SizingEnumToNumericMapping: { [key: string]: number } = {
  [SizingEnum.Mm]: 0,
  [SizingEnum.Cm]: 1,
  [SizingEnum.M]: 2,
  [SizingEnum.Km]: 3,
  [SizingEnum.Inch]: 4,
  [SizingEnum.Foot]: 5,
  [SizingEnum.Yard]: 6,
  [SizingEnum.Mile]: 7,
};

export const NumericToSizingEnumMapping: { [key: number]: SizingEnum } = {};
Object.values(SizingEnum).forEach((value) => {
  NumericToSizingEnumMapping[SizingEnumToNumericMapping[value]] = value;
});

export const isSizingEnum = (type: unknown): type is SizingEnum => {
  if (!(typeof type === 'string')) {
    return false;
  }
  return Object.values(SizingEnum).includes(type as SizingEnum);
};


export enum VolumeEnum {
  L = 'l',
  Ml = 'ml',
  Cm3 = 'cm3',
  M3 = 'm3',
  FluidOunce = 'fl oz',
  Gill = 'gi',
  Pint = 'pt',
  Quart = 'qt',
  Gallon = 'gal',
}

export const VolumeEnumToNumericMapping: { [key: string]: number } = {
  [VolumeEnum.L]: 0,
  [VolumeEnum.Ml]: 1,
  [VolumeEnum.Cm3]: 2,
  [VolumeEnum.M3]: 3,
  [VolumeEnum.FluidOunce]: 4,
  [VolumeEnum.Gill]: 5,
  [VolumeEnum.Pint]: 6,
  [VolumeEnum.Quart]: 7,
  [VolumeEnum.Gallon]: 8,
};

export const NumericToVolumeEnumMapping: { [key: number]: VolumeEnum } = {};
Object.values(VolumeEnum).forEach((value) => {
  NumericToVolumeEnumMapping[VolumeEnumToNumericMapping[value]] = value;
});

export const isVolumeEnum = (type: unknown): type is VolumeEnum => {
  if (!(typeof type === 'string')) {
    return false;
  }
  return Object.values(VolumeEnum).includes(type as VolumeEnum);
};


export enum MassEnum {
  G = 'g',
  Kg = 'kg',
  T = 't',
  Ounce = 'oz',
  Pound = 'lb',
  Stone = 'st',
  Quarter = 'qtr',
  Hundredweight = 'cwt',
  Tonne = 'ton',
}

export const MassEnumToNumericMapping: { [key: string]: number } = {
  [MassEnum.G]: 0,
  [MassEnum.Kg]: 1,
  [MassEnum.T]: 2,
  [MassEnum.Ounce]: 3,
  [MassEnum.Pound]: 4,
  [MassEnum.Stone]: 5,
  [MassEnum.Quarter]: 6,
  [MassEnum.Hundredweight]: 7,
  [MassEnum.Tonne]: 8,
};

export const NumericToMassEnumMapping: { [key: number]: MassEnum } = {};
Object.values(MassEnum).forEach((value) => {
  NumericToMassEnumMapping[MassEnumToNumericMapping[value]] = value;
});

export const isMassEnum = (type: unknown): type is MassEnum => {
  if (!(typeof type === 'string')) {
    return false;
  }
  return Object.values(MassEnum).includes(type as MassEnum);
};