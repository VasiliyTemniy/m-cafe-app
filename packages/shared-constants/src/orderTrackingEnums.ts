export enum OrderTrackingStatus {
  Acquired = 0,
  Sorting = 1,
  Prepared = 2,
  Transit = 3,
  Lost = 4,
  Ready = 5, // for a pickup
}

export const isOrderTrackingStatus = (state: unknown): state is OrderTrackingStatus =>
  (typeof state === 'number' || typeof state === 'string') && (state in OrderTrackingStatus);