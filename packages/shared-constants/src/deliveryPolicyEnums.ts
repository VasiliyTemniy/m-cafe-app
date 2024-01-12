export enum DeliveryCostCalculationType {
  External = 0,
  Manual = 1,
  Fixed = 2,
  FlatRate = 3,
  DistanceBased = 4,
  WeightOrVolumeBased = 5,
}

export const isDeliveryCostCalculationType = (type: unknown): type is DeliveryCostCalculationType =>
  (typeof type === 'number' || typeof type === 'string') &&
  (type in DeliveryCostCalculationType);