export enum TagParentType {
  Product = 0,
  Picture = 1,
  Organization = 2,
  Facility = 3
}

export const isTagParentType = (value: unknown): value is TagParentType =>
  (typeof value === 'number' || typeof value === 'string') && (value in TagParentType);