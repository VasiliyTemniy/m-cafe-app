export enum ContactType {
  Phone = 'phone',
  Email = 'email',
  Web = 'web',
  Address = 'address',
  Social = 'social',
  Other = 'other',
}

export const ContactTypeToNumericMapping = {
  [ContactType.Phone]: 0,
  [ContactType.Email]: 1,
  [ContactType.Web]: 2,
  [ContactType.Address]: 3,
  [ContactType.Social]: 4,
  [ContactType.Other]: 5,
};

export const NumericToContactTypeMapping: { [key: number]: ContactType } = {};
Object.values(ContactType).forEach((value) => {
  NumericToContactTypeMapping[ContactTypeToNumericMapping[value]] = value;
});

export const isContactType = (type: unknown): type is ContactType => {
  if (!(typeof type === 'string')) {
    return false;
  }
  return Object.values(ContactType).includes(type as ContactType);
};


export enum ContactParentType {
  Organization = 'organization',
  Facility = 'facility',
  User = 'User',
  Carrier = 'carrier',
}

export const ContactParentTypeToNumericMapping = {
  [ContactParentType.Organization]: 0,
  [ContactParentType.Facility]: 1,
  [ContactParentType.User]: 2,
  [ContactParentType.Carrier]: 3,
};

export const NumericToContactParentTypeMapping: { [key: string]: ContactParentType } = {};
Object.values(ContactParentType).forEach((value) => {
  NumericToContactParentTypeMapping[ContactParentTypeToNumericMapping[value]] = value;
});

export const isContactParentType = (type: unknown): type is ContactParentType => {
  if (!(typeof type === 'string')) {
    return false;
  }
  return Object.values(ContactParentType).includes(type as ContactParentType);
};


/**
 * Represents visibility coverage and showup placements of a contact\
 * Example:
 * @Organization target contact will be visible to all users on organization's page
 * @Order target contact will be visible on dispute-related and delivery-related pages
 */
export enum ContactTarget {
  All = 'all',
  Organization = 'organization',
  Facility = 'facility',
  Manager = 'manager',
  Carrier = 'carrier',
  Customer = 'customer',
  Order = 'order',
  Event = 'event',
  Offer = 'offer',
  TechSupport = 'techSupport',
}

export const ContactTargetToNumericMapping = {
  [ContactTarget.All]: 0,
  [ContactTarget.Organization]: 1,
  [ContactTarget.Facility]: 2,
  [ContactTarget.Manager]: 3,
  [ContactTarget.Carrier]: 4,
  [ContactTarget.Customer]: 5,
  [ContactTarget.Order]: 6,
  [ContactTarget.Event]: 7,
  [ContactTarget.Offer]: 8,
  [ContactTarget.TechSupport]: 9,
};

export const NumericToContactTargetMapping: { [key: string]: ContactTarget } = {};
Object.values(ContactTarget).forEach((value) => {
  NumericToContactTargetMapping[ContactTargetToNumericMapping[value]] = value;
});

export const isContactTarget = (target: unknown): target is ContactTarget => {
  if (!(typeof target === 'string')) {
    return false;
  }
  return Object.values(ContactTarget).includes(target as ContactTarget);
};