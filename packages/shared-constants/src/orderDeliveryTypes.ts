export enum OrderDeliveryType {
  FacilityPickup = 'facilityPickup',
  HomeDelivery = 'homeDelivery',
}

export const OrderDeliveryTypeNumericMapping = {
  [OrderDeliveryType.FacilityPickup]: 0,
  [OrderDeliveryType.HomeDelivery]: 1,
};

export const NumericToOrderDeliveryTypeMapping: { [key: number]: OrderDeliveryType } = {};
Object.values(OrderDeliveryType).forEach((value) => {
  NumericToOrderDeliveryTypeMapping[OrderDeliveryTypeNumericMapping[value]] = value;
});

export const isOrderDeliveryType = (type: unknown): type is OrderDeliveryType => {
  if (!(typeof type === 'string')) {
    return false;
  }
  return Object.values(OrderDeliveryType).includes(type as OrderDeliveryType);
};