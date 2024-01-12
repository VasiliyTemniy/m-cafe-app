export enum DetailGroupParentType {
  Product = 0,
  Organization = 1,
  Facility = 2,
}

export const isDetailGroupParentType = (
  value: unknown
): value is DetailGroupParentType =>
  (typeof value === 'number' || typeof value === 'string') &&
  (value in DetailGroupParentType);