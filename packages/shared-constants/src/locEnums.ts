export enum LocParentType {
  FixedLoc = 0,
  Picture = 1,
  Organization = 2,
  ProductType = 3,
  ProductCategory = 4,
  Product = 5,
  Ingredient = 6,
  Facility = 7,
  DynamicModule = 8,
  SaleEvent = 9,
  PromoEvent = 10,
  Semantics = 11,
  SemanticValue = 12,
  DetailGroup = 13,
  Detail = 14,
  Tag = 15,
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