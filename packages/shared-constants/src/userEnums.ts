/**
 * Represents basic User rights\
 * Role/Permission model is applied only for Managers\
 * Other rights have hardcoded restrictions
 */
export enum UserRights {
  AppAdmin = 0,
  OrgAdmin = 1,
  Customer = 2,
  Manager = 3,
  Carrier = 4,
  Moderator = 5,
  Disabled = 6
}

export const isUserRights = (rights: unknown): rights is UserRights =>
  (typeof rights === 'number' || typeof rights === 'string') && (rights in UserRights);