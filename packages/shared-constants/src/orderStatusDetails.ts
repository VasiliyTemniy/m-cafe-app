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