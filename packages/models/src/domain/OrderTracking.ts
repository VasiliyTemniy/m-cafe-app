import type { OrderTrackingStatus } from '@m-cafe-app/shared-constants';
import type { Carrier } from './Carrier';


export class OrderTracking {
  constructor (
    readonly status: OrderTrackingStatus,
    readonly pointNumber: number,
    readonly estimatedDeliveryAt: Date,
    readonly massControlValue?: number,
    readonly deliveredAt?: Date,
    readonly carrier?: Carrier,
    readonly createdAt?: Date,
    readonly updatedAt?: Date
  ) {}
}