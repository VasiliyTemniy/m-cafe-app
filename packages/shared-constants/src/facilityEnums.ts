export enum FacilityType {
  Catering = 'catering',
  PickupPoint = 'pickupPoint',
  Warehouse = 'warehouse',
  Store = 'store',
  Production = 'production',
}

export const FacilityTypeNumericMapping = {
  [FacilityType.Catering]: 0,
  [FacilityType.PickupPoint]: 1,
  [FacilityType.Warehouse]: 2,
  [FacilityType.Store]: 3,
  [FacilityType.Production]: 4
};

export const NumericToFacilityTypeMapping: { [key: number]: FacilityType } = {};
Object.values(FacilityType).forEach((value) => {
  NumericToFacilityTypeMapping[FacilityTypeNumericMapping[value]] = value;
});

export const isFacilityType = (type: unknown): type is FacilityType => {
  if (!(typeof type === 'string')) {
    return false;
  }
  return Object.values(FacilityType).includes(type as FacilityType);
};