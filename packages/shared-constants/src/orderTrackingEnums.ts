export enum OrderTrackingStatus {
  Acquired = 'acquired',
  Sorting = 'sorting',
  Prepared = 'prepared',
  Transit = 'transit',
  Lost = 'lost',
  Ready = 'ready', // for a pickup
}

export const OrderTrackingStatusNumericMapping = {
  [OrderTrackingStatus.Acquired]: 0,
  [OrderTrackingStatus.Sorting]: 1,
  [OrderTrackingStatus.Prepared]: 2,
  [OrderTrackingStatus.Transit]: 3,
  [OrderTrackingStatus.Lost]: 4,
  [OrderTrackingStatus.Ready]: 5,
};

export const NumericToOrderTrackingStatusMapping: { [key: number]: OrderTrackingStatus } = {};
Object.values(OrderTrackingStatus).forEach((value) => {
  NumericToOrderTrackingStatusMapping[OrderTrackingStatusNumericMapping[value]] = value;
});

export const isOrderTrackingStatus = (state: unknown): state is OrderTrackingStatus => {
  if (!(typeof state === 'string')) {
    return false;
  }
  return Object.values(OrderTrackingStatus).includes(state as OrderTrackingStatus);
};