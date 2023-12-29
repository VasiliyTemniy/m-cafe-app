export enum PermissionTarget {
  Address = 0,
  Loc = 1,
  Picture = 2,
  User = 3, // to change rights to 'customized' or read only
  OfferPolicy = 4,
  OrderPolicy = 5,
  DeliveryPolicy = 6,
  Role = 7, // to create/read roles
  UserRole = 8, // to give roles to users
  Permission = 9, // to create/read permissions
  RolePermission = 10,
  Product = 11,
  Ingredient = 12,
  Facility = 13,
  Stock = 14,
  Order = 15, // must apply all special checks and implement system of customer-approved changes to orders
  OrderProduct = 16, // must apply all special checks and implement system of customer-approved changes to orders
  OrderTracking = 17,
  DynamicModule = 18,
  UiSetting = 19,
  Carrier = 20,
  Offer = 21,
  SaleEvent = 22,
  PromoEvent = 23,
  Contact = 24,
}

export const isPermissionTarget = (target: unknown): target is PermissionTarget =>
  (typeof target === 'number' || typeof target === 'string') && (target in PermissionTarget);


export enum PermissionAccess {
  Organization = 0,
  Own = 1,
  ByCoverage = 2,
}

export const isPermissionAccess = (access: unknown): access is PermissionAccess =>
  (typeof access === 'number' || typeof access === 'string') && (access in PermissionAccess);


export enum PermissionAction {
  All = 0,
  R = 1,  // read
  W = 2,  // write
  U = 3,  // update
  D = 4,  // delete
  RW = 5,
  RU = 6,
  RD = 7,
  RWD = 8,
  RWU = 9,
}

export const isPermissionAction = (action: unknown): action is PermissionAction =>
  (typeof action === 'number' || typeof action === 'string') && (action in PermissionAction);