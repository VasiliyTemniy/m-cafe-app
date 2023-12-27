/**
 * Represents basic User rights\
 * Role/Permission model is applied only for Managers\
 * Other rights have hardcoded restrictions
 */
export enum UserRights {
  AppAdmin = 'appAdmin',
  OrgAdmin = 'orgAdmin',
  Customer = 'customer',
  Manager = 'manager',
  Carrier = 'carrier',
  Moderator = 'moderator',
  Disabled = 'disabled'
}

export const UserRightsNumericMapping = {
  [UserRights.AppAdmin]: 0,
  [UserRights.OrgAdmin]: 1,
  [UserRights.Customer]: 2,
  [UserRights.Manager]: 3,
  [UserRights.Carrier]: 4,
  [UserRights.Moderator]: 5,
  [UserRights.Disabled]: 6
};

export const NumericToUserRightsMapping: { [key: number]: UserRights } = {};
Object.values(UserRights).forEach((value) => {
  NumericToUserRightsMapping[UserRightsNumericMapping[value]] = value;
});

export const isUserRights = (target: unknown): target is UserRights => {
  if (!(typeof target === 'string')) {
    return false;
  }
  return Object.values(UserRights).includes(target as UserRights);
};