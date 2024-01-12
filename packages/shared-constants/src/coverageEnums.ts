export enum CoverageParentType {
  OfferPolicy = 0,
  DeliveryPolicy = 1,
  OrderPolicy = 2,
  SaleEvent = 3,
  PromoEvent = 4,
  Permission = 5,
}

export const isCoverageParentType = (type: unknown): type is CoverageParentType =>
  (typeof type === 'number' || typeof type === 'string') && (type in CoverageParentType);


export enum CoverageEntityType {
  Organization = 0,
  Product = 1,
  ProductType = 2,
  Category = 3,
  Facility = 4,
}

export const isCoverageEntityType = (type: unknown): type is CoverageEntityType =>
  (typeof type === 'number' || typeof type === 'string') && (type in CoverageEntityType);