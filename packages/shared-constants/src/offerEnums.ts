export enum OfferType {
  Bonus = 0,
  Discount = 1,
  Delivery = 2,
  Combined = 3,
}

export const isOfferType = (type: unknown): type is OfferType =>
  (typeof type === 'number' || typeof type === 'string') && (type in OfferType);


export enum OfferGrantMethod {
  Auto = 0,
  AutoOnDemand = 1,
  Manual = 2,
}

export const isOfferGrantMethod = (type: unknown): type is OfferGrantMethod =>
  (typeof type === 'number' || typeof type === 'string') && (type in OfferGrantMethod);


export enum OfferCodeGenerationMethod {
  Manual = 0,
  UUID = 1,
  PickFromPredefined = 2,
  // TODO: add other
}

export const isOfferCodeGenerationMethod = (type: unknown): type is OfferCodeGenerationMethod =>
  (typeof type === 'number' || typeof type === 'string') && (type in OfferCodeGenerationMethod);