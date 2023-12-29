export enum LocParentType {
  Language = 0,
  FixedLoc = 1,
  Currency = 2,
  Picture = 3,
  Organization = 4,
  ProductType = 5,
  ProductCategory = 6,
  Product = 7,
  Ingredient = 8,
  Facility = 9,
  DynamicModule = 10,
  SaleEvent = 11,
  PromoEvent = 12,
  Semantics = 13,
  SemanticValue = 14,
  DetailGroup = 15,
  Detail = 16,
  Tag = 17,
}

export const isLocParentType = (type: unknown): type is LocParentType =>
  (typeof type === 'number' || typeof type === 'string') && (type in LocParentType);


export enum LocType {
  Name = 0,
  Description = 1,
  StockMeasure = 2,
  Value = 3,
  Text = 4,
}

export const isLocType = (type: unknown): type is LocType =>
  (typeof type === 'number' || typeof type === 'string') && (type in LocType);