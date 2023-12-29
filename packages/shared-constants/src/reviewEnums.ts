export enum ReviewParentType {
  Product = 0,
  Facility = 1,
  Order = 2,
}

export const isReviewParentType = (type: unknown): type is ReviewParentType =>
  (typeof type === 'number' || typeof type === 'string') &&
  (type in ReviewParentType);