export enum CoverageParentType {
  OfferPolicy = 'offerPolicy',
  DeliveryPolicy = 'deliveryPolicy',
  OrderPolicy = 'orderPolicy',
  SaleEvent = 'saleEvent',
  PromoEvent = 'promoEvent',
  Permission = 'permission',
}

export const CoverageParentTypeNumericMapping = {
  [CoverageParentType.OfferPolicy]: 0,
  [CoverageParentType.DeliveryPolicy]: 1,
  [CoverageParentType.OrderPolicy]: 2,
  [CoverageParentType.SaleEvent]: 3,
  [CoverageParentType.PromoEvent]: 4,
  [CoverageParentType.Permission]: 5,
};

export const NumericToCoverageParentTypeMapping: { [key: number]: CoverageParentType } = {};
Object.values(CoverageParentType).forEach((value) => {
  NumericToCoverageParentTypeMapping[CoverageParentTypeNumericMapping[value]] = value;
});

export const isCoverageParentType = (type: unknown): type is CoverageParentType => {
  if (!(typeof type === 'string')) {
    return false;
  }
  return Object.values(CoverageParentType).includes(type as CoverageParentType);
};


export enum CoverageEntityType {
  Organization = 'organization',
  Product = 'product',
  ProductType = 'productType',
  Category = 'category',
  Facility = 'facility',
}

export const CoverageEntityTypeNumericMapping = {
  [CoverageEntityType.Organization]: 0,
  [CoverageEntityType.Product]: 1,
  [CoverageEntityType.ProductType]: 2,
  [CoverageEntityType.Category]: 3,
  [CoverageEntityType.Facility]: 4,
};

export const NumericToCoverageEntityTypeMapping: { [key: number]: CoverageEntityType } = {};
Object.values(CoverageEntityType).forEach((value) => {
  NumericToCoverageEntityTypeMapping[CoverageEntityTypeNumericMapping[value]] = value;
});

export const isCoverageEntityType = (type: unknown): type is CoverageEntityType => {
  if (!(typeof type === 'string')) {
    return false;
  }
  return Object.values(CoverageEntityType).includes(type as CoverageEntityType);
};