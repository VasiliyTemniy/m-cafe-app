export enum LocParentType {
  Language = 'language',
  Product = 'product',
  ProductType = 'productType',
  ProductCategory = 'productCategory',
  Facility = 'facility',
  Ingredient = 'ingredient',
  Picture = 'picture',
  FixedLoc = 'fixedLoc',
  DynamicModule = 'dynamicModule'
}

export const LocParentNumericMapping = {
  [LocParentType.Language]: 0,
  [LocParentType.Product]: 1,
  [LocParentType.ProductType]: 2,
  [LocParentType.ProductCategory]: 3,
  [LocParentType.Facility]: 4,
  [LocParentType.Ingredient]: 5,
  [LocParentType.Picture]: 6,
  [LocParentType.FixedLoc]: 7,
  [LocParentType.DynamicModule]: 8
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