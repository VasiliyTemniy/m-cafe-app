export enum PermissionTarget {
  Address = 'address',
  Loc = 'loc',
  Picture = 'picture',
  User = 'user', // to change rights to 'customized' or read only
  OfferPolicy = 'offerPolicy',
  OrderPolicy = 'orderPolicy',
  DeliveryPolicy = 'deliveryPolicy',
  Role = 'role', // to create/read roles
  UserRole = 'userRole', // to give roles to users
  Permission = 'permission', // to create/read permissions
  RolePermission = 'rolePermission',
  Product = 'product',
  Ingredient = 'ingredient',
  Facility = 'facility',
  Stock = 'stock',
  Order = 'order', // must apply all special checks and implement system of customer-approved changes to orders
  OrderProduct = 'orderProduct', // must apply all special checks and implement system of customer-approved changes to orders
  OrderTracking = 'orderTracking',
  DynamicModule = 'dynamicModule',
  UiSetting = 'uiSetting',
  Carrier = 'carrier',
  Offer = 'offer',
  SaleEvent = 'saleEvent',
  PromoEvent = 'promoEvent',
  Contact = 'contact',
}

export const PermissionTargetNumericMapping = {
  [PermissionTarget.Address]: 0,
  [PermissionTarget.Loc]: 1,
  [PermissionTarget.Picture]: 2,
  [PermissionTarget.User]: 3,
  [PermissionTarget.OfferPolicy]: 4,
  [PermissionTarget.OrderPolicy]: 5,
  [PermissionTarget.DeliveryPolicy]: 6,
  [PermissionTarget.Role]: 7,
  [PermissionTarget.UserRole]: 8,
  [PermissionTarget.Permission]: 9,
  [PermissionTarget.RolePermission]: 10,
  [PermissionTarget.Product]: 11,
  [PermissionTarget.Ingredient]: 12,
  [PermissionTarget.Facility]: 13,
  [PermissionTarget.Stock]: 14,
  [PermissionTarget.Order]: 15,
  [PermissionTarget.OrderProduct]: 16,
  [PermissionTarget.OrderTracking]: 17,
  [PermissionTarget.DynamicModule]: 18,
  [PermissionTarget.UiSetting]: 19,
  [PermissionTarget.Carrier]: 20,
  [PermissionTarget.Offer]: 21,
  [PermissionTarget.SaleEvent]: 22,
  [PermissionTarget.PromoEvent]: 23,
  [PermissionTarget.Contact]: 24,
};

export const NumericToPermissionTargetMapping: { [key: number]: PermissionTarget } = {};
Object.values(PermissionTarget).forEach((value) => {
  NumericToPermissionTargetMapping[PermissionTargetNumericMapping[value]] = value;
});

export const isPermissionTarget = (target: unknown): target is PermissionTarget => {
  if (!(typeof target === 'string')) {
    return false;
  }
  return Object.values(PermissionTarget).includes(target as PermissionTarget);
};


export enum PermissionAccess {
  Organization = 'organization',
  Own = 'own',
  ByCoverage = 'byCoverage',
}

export const PermissionAccessNumericMapping = {
  [PermissionAccess.Organization]: 0,
  [PermissionAccess.Own]: 1,
  [PermissionAccess.ByCoverage]: 2,
};

export const NumericToPermissionAccessMapping: { [key: number]: PermissionAccess } = {};
Object.values(PermissionAccess).forEach((value) => {
  NumericToPermissionAccessMapping[PermissionAccessNumericMapping[value]] = value;
});

export const isPermissionAccess = (access: unknown): access is PermissionAccess => {
  if (!(typeof access === 'string')) {
    return false;
  }
  return Object.values(PermissionAccess).includes(access as PermissionAccess);
};


export enum PermissionAction {
  All = 'all',
  R = 'r',  // read
  W = 'w',  // write
  U = 'u',  // update
  D = 'd',  // delete
  RW = 'rw',
  RU = 'ru',
  RD = 'rd',
  RWD = 'rwd',
  RWU = 'rwu',
}

export const PermissionActionNumericMapping = {
  [PermissionAction.All]: 0,
  [PermissionAction.R]: 1,
  [PermissionAction.W]: 2,
  [PermissionAction.U]: 3,
  [PermissionAction.D]: 4,
  [PermissionAction.RW]: 5,
  [PermissionAction.RU]: 6,
  [PermissionAction.RD]: 7,
  [PermissionAction.RWD]: 8,
  [PermissionAction.RWU]: 9,
};

export const NumericToPermissionActionMapping: { [key: number]: PermissionAction } = {};
Object.values(PermissionAction).forEach((value) => {
  NumericToPermissionActionMapping[PermissionActionNumericMapping[value]] = value;
});

export const isPermissionAction = (action: unknown): action is PermissionAction => {
  if (!(typeof action === 'string')) {
    return false;
  }
  return Object.values(PermissionAction).includes(action as PermissionAction);
};