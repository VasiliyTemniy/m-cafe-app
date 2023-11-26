import type { OrderPaymentMethod, OrderPaymentStatus, OrderStatus } from '@m-cafe-app/shared-constants';
import type { Address } from './Address.js';
import type { FacilityS } from './Facility.js';
import type { OrderFood } from './OrderFood.js';
import type { User } from './User.js';


/**
 * Order contains user info such as customerPhonenumber and archiveAddress as string,
 * info about facility, totalCost, orderFoods, status, deliverAt,
 * optionally contains customerName, full user-customer record,
 * full address record \
 * Customer name is optional because order can be created without logging into the app,
 * somebody can provide phonenumber but not name, name must be questioned by manager
 * while calling to ensure order creation
 */
export class Order {
  constructor (
    readonly id: number,
    readonly deliverAt: Date,
    readonly status: OrderStatus,
    readonly orderFoods: OrderFood[],
    readonly facility: FacilityS,
    readonly totalCost: number,
    readonly archiveAddress: string,
    readonly customerPhonenumber: string,
    readonly customerName: string,
    readonly paymentMethod: OrderPaymentMethod,
    readonly paymentStatus: OrderPaymentStatus,
    readonly tablewareQuantity: number,
    readonly comment?: string,
    readonly user?: User,
    readonly address?: Address,
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
    readonly deliverAt: Date,
    readonly status: OrderStatus,
    readonly orderFoods: OrderFood[],
    readonly facility: FacilityS,
    readonly totalCost: number,
    readonly archiveAddress: string,
    readonly customerPhonenumber: string,
    readonly customerName: string,
    readonly paymentMethod: OrderPaymentMethod,
    readonly paymentStatus: OrderPaymentStatus,
    readonly tablewareQuantity: number,
  ) {}
}