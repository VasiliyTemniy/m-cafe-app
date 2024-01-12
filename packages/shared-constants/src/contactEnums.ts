export enum ContactType {
  Phone = 0,
  Email = 1,
  Web = 2,
  Address = 3,
  Social = 4,
  Other = 5,
}

export const isContactType = (type: unknown): type is ContactType =>
  (typeof type === 'number' || typeof type === 'string') && (type in ContactType);


export enum ContactParentType {
  Organization = 0,
  Facility = 1,
  User = 2,
  Carrier = 3,
}

export const isContactParentType = (type: unknown): type is ContactParentType =>
  (typeof type === 'number' || typeof type === 'string') && (type in ContactParentType);


/**
 * Represents visibility coverage and showup placements of a contact\
 * Example:
 * @Organization target contact will be visible to all users on organization's page
 * @Order target contact will be visible on dispute-related and delivery-related pages
 */
export enum ContactTarget {
  All = 0,
  Organization = 1,
  Facility = 2,
  Manager = 3,
  Carrier = 4,
  Customer = 5,
  Order = 6,
  Event = 7,
  Offer = 8,
  TechSupport = 9,
}

export const isContactTarget = (target: unknown): target is ContactTarget =>
  (typeof target === 'number' || typeof target === 'string') && (target in ContactTarget);