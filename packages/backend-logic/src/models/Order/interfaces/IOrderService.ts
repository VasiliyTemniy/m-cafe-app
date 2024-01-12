import type { OrderDT, OrderDTN, OrderDTU } from '@m-cafe-app/models';
import type { ICRUDService } from '../../../utils';
import type { OrderPaymentMethod, OrderPaymentStatus, OrderStatus } from '@m-cafe-app/shared-constants';

export interface IOrderService extends Omit<ICRUDService<OrderDT, OrderDTN>, 'update'> {
  /**
   * @param limit - default 10
   * @param offset - default 0
   * @param userId - optional filter
   * @param status - optional filter
   * @param facilityId - optional filter
   * @param paymentMethod - optional filter
   * @param paymentStatus - optional filter
   */
  getSome(
    limit?: number,
    offset?: number,
    userId?: number,
    status?: OrderStatus,
    facilityId?: number,
    paymentMethod?: OrderPaymentMethod,
    paymentStatus?: OrderPaymentStatus
  ): Promise<OrderDT[]>;
  update(orderDTU: OrderDTU): Promise<OrderDT>;
  updateStatus(id: number, status?: OrderStatus, paymentStatus?: OrderPaymentStatus): Promise<OrderDT>;
}