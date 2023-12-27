export enum OrderStatus {
  Accepted = 'accepted',
  Cooking = 'cooking',
  Pending = 'pending',
  Preparing = 'preparing',
  Sorting = 'sorting',
  Delivering = 'delivering',
  Delivered = 'delivered',
  Cancelled = 'cancelled',
  Rejected = 'rejected',
  Transit = 'transit',
  Lost = 'lost',
  Ready = 'ready', // for a pickup
  Unconfirmed = 'unconfirmed',
}

export const OrderStatusToNumericMapping = {
  [OrderStatus.Accepted]: 0,
  [OrderStatus.Cooking]: 1,
  [OrderStatus.Pending]: 2,
  [OrderStatus.Preparing]: 3,
  [OrderStatus.Sorting]: 4,
  [OrderStatus.Delivering]: 5,
  [OrderStatus.Delivered]: 6,
  [OrderStatus.Cancelled]: 7,
  [OrderStatus.Rejected]: 8,
  [OrderStatus.Transit]: 9,
  [OrderStatus.Lost]: 10,
  [OrderStatus.Ready]: 11,
  [OrderStatus.Unconfirmed]: 12,
};

export const NumericToOrderStatusMapping: { [key: string]: OrderStatus } = {};
Object.values(OrderStatus).forEach((value) => {
  NumericToOrderStatusMapping[OrderStatusToNumericMapping[value]] = value;
});

export const isOrderStatus = (status: unknown): status is OrderStatus => {
  if (!(typeof status === 'string')) {
    return false;
  }
  return Object.values(OrderStatus).includes(status as OrderStatus);
};



export enum OrderPaymentMethod {
  Cash = 'cash',
  Card = 'card',
  Online = 'online',
}

export const OrderPaymentMethodToNumericMapping = {
  [OrderPaymentMethod.Cash]: 0,
  [OrderPaymentMethod.Card]: 1,
  [OrderPaymentMethod.Online]: 2,
};

export const NumericToOrderPaymentMethodMapping: { [key: string]: OrderPaymentMethod } = {};
Object.values(OrderPaymentMethod).forEach((value) => {
  NumericToOrderPaymentMethodMapping[OrderPaymentMethodToNumericMapping[value]] = value;
});

export const isOrderPaymentMethod = (paymentMethod: unknown): paymentMethod is OrderPaymentMethod => {
  if (!(typeof paymentMethod === 'string')) {
    return false;
  }
  return Object.values(OrderPaymentMethod).includes(paymentMethod as OrderPaymentMethod);
};



export enum OrderPaymentStatus {
  Paid = 'paid',
  Unpaid = 'unpaid',
  Refunded = 'refunded',
}

export const OrderPaymentStatusToNumericMapping = {
  [OrderPaymentStatus.Paid]: 0,
  [OrderPaymentStatus.Unpaid]: 1,
  [OrderPaymentStatus.Refunded]: 2,
};

export const NumericToOrderPaymentStatusMapping: { [key: string]: OrderPaymentStatus } = {};
Object.values(OrderPaymentStatus).forEach((value) => {
  NumericToOrderPaymentStatusMapping[OrderPaymentStatusToNumericMapping[value]] = value;
});

export const isOrderPaymentStatus = (paymentStatus: unknown): paymentStatus is OrderPaymentStatus => {
  if (!(typeof paymentStatus === 'string')) {
    return false;
  }
  return Object.values(OrderPaymentStatus).includes(paymentStatus as OrderPaymentStatus);
};


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


export enum OrderDistanceAvailability {
  Anywhere = 'anywhere',
  SameCountry = 'sameCountry',
  SameRegion = 'sameRegion',
  SameCity = 'sameCity',
}

export const OrderDistanceAvailabilityNumericMapping = {
  [OrderDistanceAvailability.Anywhere]: 0,
  [OrderDistanceAvailability.SameCountry]: 1,
  [OrderDistanceAvailability.SameRegion]: 2,
  [OrderDistanceAvailability.SameCity]: 3,
};

export const NumericToOrderDistanceAvailabilityMapping: { [key: number]: OrderDistanceAvailability } = {};
Object.values(OrderDistanceAvailability).forEach((value) => {
  NumericToOrderDistanceAvailabilityMapping[OrderDistanceAvailabilityNumericMapping[value]] = value;
});

export const isOrderDistanceAvailability = (availability: unknown): availability is OrderDistanceAvailability => {
  if (!(typeof availability === 'string')) {
    return false;
  }
  return Object.values(OrderDistanceAvailability).includes(availability as OrderDistanceAvailability);
};


export enum OrderConfirmationMethod {
  Auto = 'auto',
  AutoCall = 'autoCall',
  AutoSMS = 'autoSMS',
  AutoEmail = 'autoEmail',
  ManualCall = 'manualCall',
  ManualSMS = 'manualSMS',
  ManualEmail = 'manualEmail',
  ManualOther = 'manualOther',
}

export const OrderConfirmationMethodToNumericMapping = {
  [OrderConfirmationMethod.Auto]: 0,
  [OrderConfirmationMethod.AutoCall]: 1,
  [OrderConfirmationMethod.AutoSMS]: 2,
  [OrderConfirmationMethod.AutoEmail]: 3,
  [OrderConfirmationMethod.ManualCall]: 4,
  [OrderConfirmationMethod.ManualSMS]: 5,
  [OrderConfirmationMethod.ManualEmail]: 6,
  [OrderConfirmationMethod.ManualOther]: 7,
};

export const NumericToOrderConfirmationMethodMapping: { [key: string]: OrderConfirmationMethod } = {};
Object.values(OrderConfirmationMethod).forEach((value) => {
  NumericToOrderConfirmationMethodMapping[OrderConfirmationMethodToNumericMapping[value]] = value;
});

export const isOrderConfirmationMethod = (method: unknown): method is OrderConfirmationMethod => {
  if (!(typeof method === 'string')) {
    return false;
  }
  return Object.values(OrderConfirmationMethod).includes(method as OrderConfirmationMethod);
};