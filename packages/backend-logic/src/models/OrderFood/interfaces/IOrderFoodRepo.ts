import type { OrderFood, OrderFoodDTN } from '@m-cafe-app/models';
import type { GenericTransaction, ICRUDRepo } from '../../../utils';


/**
 * Helper interface for OrderFood - processed in OrderFoodService
 */
export interface OrderFoodItem {
  orderFoodDTN: OrderFoodDTN;
  archivePrice: number;
  archiveFoodId: number;
  archiveFoodName: string;
}


export interface IOrderFoodRepo extends Omit<ICRUDRepo<OrderFood, OrderFoodDTN>, 'getAll' | 'create' | 'createMany'> {
  getAllByOrderId(orderId: number): Promise<OrderFood[]>;
  create(
    item: OrderFoodItem,
    transaction?: GenericTransaction
  ): Promise<OrderFood>;
  createMany(
    items: OrderFoodItem[],
    transaction?: GenericTransaction
  ): Promise<OrderFood[]>;
  /**
   * Changes only the quantity, to change other fields delete the record and create a new
   */
  update(
    updOrderFood: OrderFood,
    transaction?: GenericTransaction
  ): Promise<OrderFood>;
  remove(orderId: number, archiveFoodId: number, transaction?: GenericTransaction): Promise<void>;
  removeByOrderId(orderId: number, transaction?: GenericTransaction): Promise<number>;
}