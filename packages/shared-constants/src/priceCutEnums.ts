export enum PriceCutPermission {
  Full = 'full',
  BonusOnly = 'bonusOnly',
  DiscountOnly = 'discountOnly',
  EventOnly = 'eventOnly',
  BonusDiscount = 'bonusDiscount',
  BonusEvent = 'bonusEvent',
  DiscountEvent = 'discountEvent',
  OneByChoice = 'oneByChoice',
  TwoByChoice = 'twoByChoice',
  None = 'none',
}

export const PriceCutPermissionToNumericMapping = {
  [PriceCutPermission.Full]: 0,
  [PriceCutPermission.BonusOnly]: 1,
  [PriceCutPermission.DiscountOnly]: 2,
  [PriceCutPermission.EventOnly]: 3,
  [PriceCutPermission.BonusDiscount]: 4,
  [PriceCutPermission.BonusEvent]: 5,
  [PriceCutPermission.DiscountEvent]: 6,
  [PriceCutPermission.OneByChoice]: 7,
  [PriceCutPermission.TwoByChoice]: 8,
  [PriceCutPermission.None]: 9
};

export const NumericToPriceCutPermissionMapping: { [key: number]: PriceCutPermission } = {};
Object.values(PriceCutPermission).forEach((value) => {
  NumericToPriceCutPermissionMapping[PriceCutPermissionToNumericMapping[value]] = value;
});

export const isPriceCutPermission = (target: unknown): target is PriceCutPermission => {
  if (!(typeof target === 'string')) {
    return false;
  }
  return Object.values(PriceCutPermission).includes(target as PriceCutPermission);
};