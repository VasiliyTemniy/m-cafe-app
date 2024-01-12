import type { OrderDeliveryType, OrderPaymentMethod, OrderPaymentStatus, OrderStatus } from '@m-market-app/shared-constants';
import type { Address } from './Address.js';
import type { FacilityS } from './Facility.js';
import type { OrderProduct } from './OrderProduct.js';
import type { User } from './User.js';
import type { OrderTracking } from './OrderTracking.js';


/**
 * Order contains user info such as customerPhonenumber and archiveAddress as string,
 * info about facility, totalCost, orderProducts, status, deliverAt, customerName,
 * optionally contains full user-customer record, box sizing, tracking code,
 * full target address record, tracking info, dispute comments \
 * Customer name is set to 'anonymous' if order is created without logging into the app,
 * somebody can provide phonenumber but not name, in this case name must be questioned by manager
 * while calling to ensure order creation
 */
export class Order {
  constructor (
    readonly id: number,
    readonly facility: FacilityS,
    readonly estimatedDeliveryAt: Date,
    readonly deliveryType: OrderDeliveryType,
    readonly status: OrderStatus,
    readonly orderProducts: OrderProduct[],
    readonly totalCost: number,
    readonly archiveAddress: string,
    readonly customerName: string,
    readonly customerPhonenumber: string,
    readonly paymentMethod: OrderPaymentMethod,
    readonly paymentStatus: OrderPaymentStatus,
    readonly boxSizingX?: number,
    readonly boxSizingY?: number,
    readonly boxSizingZ?: number,
    readonly comment?: string,
    readonly trackingCode?: string,
    readonly user?: User,
    readonly address?: Address,
    readonly tracking?: OrderTracking[],
    readonly disputeComments?: Comment[],
    readonly deliverAt?: Date,
    readonly createdAt?: Date,
    readonly updatedAt?: Date,
  ) {}
}

/**
 * Contains only most necessary info about the order
 */
export class OrderS {
  constructor (
    readonly id: number,
    readonly facility: FacilityS,
    readonly estimatedDeliveryAt: Date,
    readonly deliveryType: OrderDeliveryType,
    readonly status: OrderStatus,
    readonly orderProducts: OrderProduct[],
    readonly totalCost: number,
    readonly archiveAddress: string,
    readonly customerName: string,
    readonly customerPhonenumber: string,
    readonly paymentMethod: OrderPaymentMethod,
    readonly paymentStatus: OrderPaymentStatus,
    readonly trackingCode?: string
  ) {}
}