export enum ViewParentType {
  Product = 0,
  Picture = 1,
  Organization = 2,
  User = 3,
  OrganizationUser = 4
}

export const isViewParentType = (value: unknown): value is ViewParentType =>
  (typeof value === 'number' || typeof value === 'string') && (value in ViewParentType);