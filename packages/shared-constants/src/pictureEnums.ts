export enum PictureParentType {
  Product = 0,
  Facility = 1,
  Ingredient = 2,
  User = 3,
  DynamicModule = 4,
  Review = 5
}

export const isPictureParentType = (type: unknown): type is PictureParentType =>
  (typeof type === 'number' || typeof type === 'string') && (type in PictureParentType);