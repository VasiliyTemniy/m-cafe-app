export enum PictureParentType {
  Product = 'product',
  Facility = 'facility',
  Ingredient = 'ingredient',
  User = 'user',
  DynamicModule = 'dynamicModule',
  Review = 'review'
}

export const PictureParentTypeNumericMapping = {
  [PictureParentType.Product]: 0,
  [PictureParentType.Facility]: 1,
  [PictureParentType.Ingredient]: 2,
  [PictureParentType.User]: 3,
  [PictureParentType.DynamicModule]: 4,
  [PictureParentType.Review]: 5
};

export const NumericToPictureParentTypeMapping: { [key: number]: PictureParentType } = {};
Object.values(PictureParentType).forEach((value) => {
  NumericToPictureParentTypeMapping[PictureParentTypeNumericMapping[value]] = value;
});

export const isPictureParentType = (type: unknown): type is PictureParentType => {
  if (!(typeof type === 'string')) {
    return false;
  }
  return Object.values(PictureParentType).includes(type as PictureParentType);
};