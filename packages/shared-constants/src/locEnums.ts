export enum LocParentType {
  Language = 'language',
  FixedLoc = 'fixedLoc',
  Currency = 'currency',
  Picture = 'picture',
  Organization = 'organization',
  OrganizationDetail = 'organizationDetail',
  ProductType = 'productType',
  ProductCategory = 'productCategory',
  Product = 'product',
  ProductDetail = 'productDetail',
  Ingredient = 'ingredient',
  Facility = 'facility',
  FacilityDetail = 'facilityDetail',
  DynamicModule = 'dynamicModule',
  SaleEvent = 'saleEvent',
  PromoEvent = 'promoEvent',
}

export const LocParentNumericMapping = {
  [LocParentType.Language]: 0,
  [LocParentType.FixedLoc]: 1,
  [LocParentType.Currency]: 2,
  [LocParentType.Picture]: 3,
  [LocParentType.Organization]: 4,
  [LocParentType.OrganizationDetail]: 5,
  [LocParentType.ProductType]: 6,
  [LocParentType.ProductCategory]: 7,
  [LocParentType.Product]: 8,
  [LocParentType.ProductDetail]: 9,
  [LocParentType.Ingredient]: 10,
  [LocParentType.Facility]: 11,
  [LocParentType.FacilityDetail]: 12,
  [LocParentType.DynamicModule]: 13,
  [LocParentType.SaleEvent]: 14,
  [LocParentType.PromoEvent]: 15,
};

export const NumericToLocParentTypeMapping: { [key: number]: LocParentType } = {};
Object.values(LocParentType).forEach((value) => {
  NumericToLocParentTypeMapping[LocParentNumericMapping[value]] = value;
});

export const isLocParentType = (type: unknown): type is LocParentType => {
  if (!(typeof type === 'string')) {
    return false;
  }
  return Object.values(LocParentType).includes(type as LocParentType);
};


export enum LocType {
  Name = 'name',
  Description = 'description',
  StockMeasure = 'stockMeasure',
  Text = 'text',
}

export const LocTypeNumericMapping = {
  [LocType.Name]: 0,
  [LocType.Description]: 1,
  [LocType.StockMeasure]: 2,
  [LocType.Text]: 3,
};

export const NumericToLocTypeMapping: { [key: number]: LocType } = {};
Object.values(LocType).forEach((value) => {
  NumericToLocTypeMapping[LocTypeNumericMapping[value]] = value;
});

export const isLocType = (type: unknown): type is LocType => {
  if (!(typeof type === 'string')) {
    return false;
  }
  return Object.values(LocType).includes(type as LocType);
};