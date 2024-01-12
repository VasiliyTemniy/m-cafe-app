import type { OrderPaymentMethod, OrderPaymentStatus, OrderStatus } from '@m-cafe-app/shared-constants';
import type { GenericTransaction, ICRUDRepo } from '../../../utils';
import type { Address, FacilityS, Order, OrderDTN, OrderFood, User } from '@m-cafe-app/models';


/**
 * Helper interface for Order - processed in OrderService
 */
export interface OrderItem {
  orderFoods: OrderFood[];
  deliverAt: Date;
  status: OrderStatus;
  totalCost: number;
  archiveAddress: string;
  customerPhonenumber: string;
  facility: FacilityS;
  customerName: string;
  paymentMethod: OrderPaymentMethod;
  paymentStatus: OrderPaymentStatus;
  tablewareQuantity: number;
  comment?: string;
  user?: User;
  address?: Address;
}


export interface IOrderRepo extends Omit<ICRUDRepo<Order, OrderDTN>, 'create'> {
  getSome(
    limit: number,
    offset: number,
    userId?: number,
    status?: OrderStatus,
    facilityId?: number,
    paymentMethod?: OrderPaymentMethod,
    paymentStatus?: OrderPaymentStatus
  ): Promise<Order[]>;
  create(
    item: OrderItem,
    transaction?: GenericTransaction
  ): Promise<Order>;
  update(
    updItem: OrderItem,
    orderId: number,
    transaction?: GenericTransaction
  ): Promise<Order>;
  updateStatus(
    orderId: number,
    status?: OrderStatus,
    paymentStatus?: OrderPaymentStatus,
    transaction?: GenericTransaction
  ): Promise<Order>;
}