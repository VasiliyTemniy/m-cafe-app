export enum ReviewParentType {
  Product = 'product',
  Facility = 'facility',
  Order = 'order',
}

export const ReviewParentTypeNumericMapping = {
  [ReviewParentType.Product]: 0,
  [ReviewParentType.Facility]: 1,
  [ReviewParentType.Order]: 2,
};

export const NumericToReviewParentTypeMapping: { [key: number]: ReviewParentType } = {};
Object.values(ReviewParentType).forEach((value) => {
  NumericToReviewParentTypeMapping[ReviewParentTypeNumericMapping[value]] = value;
});

export const isReviewParentType = (type: unknown): type is ReviewParentType => {
  if (!(typeof type === 'string')) {
    return false;
  }
  return Object.values(ReviewParentType).includes(type as ReviewParentType);
};