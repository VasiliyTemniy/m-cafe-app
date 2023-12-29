export enum FacilityType {
  Catering = 0,
  PickupPoint = 1,
  Warehouse = 2,
  Store = 3,
  Production = 4,
}

export const isFacilityType = (type: unknown): type is FacilityType =>
  (typeof type === 'number' || typeof type === 'string') && (type in FacilityType);