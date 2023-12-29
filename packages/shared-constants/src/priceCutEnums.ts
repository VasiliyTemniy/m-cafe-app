export enum PriceCutPermission {
  Full = 0,
  BonusOnly = 1,
  DiscountOnly = 2,
  EventOnly = 3,
  BonusDiscount = 4,
  BonusEvent = 5,
  DiscountEvent = 6,
  OneByChoice = 7,
  TwoByChoice = 8,
  None = 9,
}

export const isPriceCutPermission = (target: unknown): target is PriceCutPermission =>
  (typeof target === 'number' || typeof target === 'string') &&
  (target in PriceCutPermission);