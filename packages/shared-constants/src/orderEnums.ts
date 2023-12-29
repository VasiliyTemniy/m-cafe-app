export enum OrderStatus {
  Accepted = 0,
  Cooking = 1,
  Pending = 2,
  Preparing = 3,
  Sorting = 4,
  Delivering = 5,
  Delivered = 6,
  Cancelled = 7,
  Rejected = 8,
  Transit = 9,
  Lost = 10,
  Ready = 11, // for a pickup
  Unconfirmed = 12,
}

export const isOrderStatus = (status: unknown): status is OrderStatus =>
  (typeof status === 'number' || typeof status === 'string') && (status in OrderStatus);



export enum OrderPaymentMethod {
  Cash = 0,
  Card = 1,
  Online = 2,
}

export const isOrderPaymentMethod = (paymentMethod: unknown): paymentMethod is OrderPaymentMethod =>
  (typeof paymentMethod === 'number' || typeof paymentMethod === 'string') && (paymentMethod in OrderPaymentMethod);


export enum OrderPaymentStatus {
  Paid = 0,
  Unpaid = 1,
  Refunded = 2,
}

export const isOrderPaymentStatus = (paymentStatus: unknown): paymentStatus is OrderPaymentStatus =>
  (typeof paymentStatus === 'number' || typeof paymentStatus === 'string') && (paymentStatus in OrderPaymentStatus);


export enum OrderDeliveryType {
  FacilityPickup = 0,
  HomeDelivery = 1,
}

export const isOrderDeliveryType = (type: unknown): type is OrderDeliveryType =>
  (typeof type === 'number' || typeof type === 'string') && (type in OrderDeliveryType);


export enum OrderDistanceAvailability {
  Anywhere = 0,
  SameCountry = 1,
  SameRegion = 2,
  SameCity = 3,
}

export const isOrderDistanceAvailability = (availability: unknown): availability is OrderDistanceAvailability =>
  (typeof availability === 'number' || typeof availability === 'string') && (availability in OrderDistanceAvailability);


export enum OrderConfirmationMethod {
  Auto = 0,
  AutoCall = 1,
  AutoSMS = 2,
  AutoEmail = 3,
  ManualCall = 4,
  ManualSMS = 5,
  ManualEmail = 6,
  ManualOther = 7,
}

export const isOrderConfirmationMethod = (method: unknown): method is OrderConfirmationMethod =>
  (typeof method === 'number' || typeof method === 'string') && (method in OrderConfirmationMethod);