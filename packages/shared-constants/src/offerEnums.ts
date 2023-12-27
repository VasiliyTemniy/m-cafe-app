export enum OfferType {
  Bonus = 'bonus',
  Discount = 'discount',
  Delivery = 'delivery',
  Combined = 'combined',
}

export const OfferTypeToNumericMapping: { [key: string]: number } = {
  [OfferType.Bonus]: 0,
  [OfferType.Discount]: 1,
  [OfferType.Delivery]: 2,
  [OfferType.Combined]: 3,
};

export const NumericToOfferTypeMapping: { [key: number]: OfferType } = {};
Object.values(OfferType).forEach((value) => {
  NumericToOfferTypeMapping[OfferTypeToNumericMapping[value]] = value;
});

export const isOfferType = (type: unknown): type is OfferType => {
  if (!(typeof type === 'string')) {
    return false;
  }
  return Object.values(OfferType).includes(type as OfferType);
};


export enum OfferGrantMethod {
  Auto = 'auto',
  AutoOnDemand = 'autoOnDemand',
  Manual = 'manual',
}

export const OfferGrantMethodToNumericMapping: { [key: string]: number } = {
  [OfferGrantMethod.Auto]: 0,
  [OfferGrantMethod.AutoOnDemand]: 1,
  [OfferGrantMethod.Manual]: 2,
};

export const NumericToOfferGrantMethodMapping: { [key: number]: OfferGrantMethod } = {};
Object.values(OfferGrantMethod).forEach((value) => {
  NumericToOfferGrantMethodMapping[OfferGrantMethodToNumericMapping[value]] = value;
});

export const isOfferGrantMethod = (type: unknown): type is OfferGrantMethod => {
  if (!(typeof type === 'string')) {
    return false;
  }
  return Object.values(OfferGrantMethod).includes(type as OfferGrantMethod);
};


export enum OfferCodeGenerationMethod {
  Manual = 'manual',
  UUID = 'uuid',
  PickFromPredefined = 'pickFromPredefined',
  // TODO: add other
}

export const OfferCodeGenerationMethodToNumericMapping: { [key: string]: number } = {
  [OfferCodeGenerationMethod.Manual]: 0,
  [OfferCodeGenerationMethod.UUID]: 1,
  [OfferCodeGenerationMethod.PickFromPredefined]: 2,
};

export const NumericToOfferCodeGenerationMethodMapping: { [key: number]: OfferCodeGenerationMethod } = {};
Object.values(OfferCodeGenerationMethod).forEach((value) => {
  NumericToOfferCodeGenerationMethodMapping[OfferCodeGenerationMethodToNumericMapping[value]] = value;
});

export const isOfferCodeGenerationMethod = (type: unknown): type is OfferCodeGenerationMethod => {
  if (!(typeof type === 'string')) {
    return false;
  }
  return Object.values(OfferCodeGenerationMethod).includes(type as OfferCodeGenerationMethod);
};