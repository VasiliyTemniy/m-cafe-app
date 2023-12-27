export enum DeliveryCostCalculationType {
  External = 'external',
  Manual = 'manual',
  Fixed = 'fixed',
  FlatRate = 'flatRate',
  DistanceBased = 'distanceBased',
  WeightOrVolumeBased = 'weightOrVolumeBased',
}

export const DeliveryCostCalculationTypeNumericMapping = {
  [DeliveryCostCalculationType.External]: 0,
  [DeliveryCostCalculationType.Manual]: 1,
  [DeliveryCostCalculationType.Fixed]: 2,
  [DeliveryCostCalculationType.FlatRate]: 3,
  [DeliveryCostCalculationType.DistanceBased]: 4,
  [DeliveryCostCalculationType.WeightOrVolumeBased]: 5,
};

export const NumericToDeliveryCostCalculationTypeMapping: { [key: number]: DeliveryCostCalculationType } = {};
Object.values(DeliveryCostCalculationType).forEach((value) => {
  NumericToDeliveryCostCalculationTypeMapping[DeliveryCostCalculationTypeNumericMapping[value]] = value;
});

export const isDeliveryCostCalculationType = (type: unknown): type is DeliveryCostCalculationType => {
  if (!(typeof type === 'string')) {
    return false;
  }
  return Object.values(DeliveryCostCalculationType).includes(type as DeliveryCostCalculationType);
};