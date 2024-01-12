import type { OrderDT, OrderDTN, OrderFoodDTN, OrderDTU, OrderFood } from '@m-market-app/models';
import type { ITransactionHandler } from '../../../utils';
import type { IOrderFoodRepo, OrderFoodItem } from '../../OrderFood';
import type { IOrderRepo, IOrderService, OrderItem } from '../interfaces';
import type { IFoodRepo } from '../../Food';
import { OrderMapper } from '../infrastructure';
import { UserMapper } from '../../User';
import { AddressMapper } from '../../Address';
import { FacilitySimpleMapper } from '../../Facility';
import { OrderStatus, type OrderPaymentMethod, OrderPaymentStatus } from '@m-market-app/shared-constants';


export class OrderService implements IOrderService {
  constructor (
    readonly orderRepo: IOrderRepo,
    readonly orderFoodRepo: IOrderFoodRepo,
    readonly foodRepo: IFoodRepo,
    readonly transactionHandler: ITransactionHandler
  ) {}

  async getAll(): Promise<OrderDT[]> {
    const orders = await this.orderRepo.getAll();

    return orders.map(order => OrderMapper.domainToDT(order));
  }

  async getById(id: number): Promise<OrderDT> {
    const order = await this.orderRepo.getById(id);

    return OrderMapper.domainToDT(order);
  }

  async getSome(
    limit?: number,
    offset?: number,
    userId?: number,
    status?: OrderStatus,
    facilityId?: number,
    paymentMethod?: OrderPaymentMethod,
    paymentStatus?: OrderPaymentStatus
  ): Promise<OrderDT[]> {

    const usedLimit = limit || 10;
    const usedOffset = offset || 0;

    const orders = await this.orderRepo.getSome(usedLimit, usedOffset, userId, status, facilityId, paymentMethod, paymentStatus);

    return orders.map(order => OrderMapper.domainToDT(order));
  }

  private aggregateInternalOrderData(
    orderDT: OrderDTN | OrderDTU,
    preparedOrderFoods: OrderFood[],
    status: OrderStatus,
    paymentStatus: OrderPaymentStatus
  ): OrderItem {
    // Calculate totalCost
    let totalCost = preparedOrderFoods.reduce((acc, orderFood) => acc + orderFood.quantity * orderFood.archivePrice, 0);

    // Round total cost. Is it needed?
    // totalCost = Math.round(totalCost / 100) * 100; // Any round you like
    totalCost = Math.round(totalCost);
    
    // TODO?: Also add your delivery cost computations here
    
    // TODO?: Also apply your discount system here
    
    // TODO!: Also facility Stock can be recalculated here
    
    
    // Aggregate archiveAddress
    const addressInfo = orderDT.address;
    
    let archiveAddress: string = '';
    archiveAddress = addressInfo?.region ?          archiveAddress + addressInfo.region + ' ' : archiveAddress;
    archiveAddress = addressInfo?.regionDistrict ?  archiveAddress + addressInfo?.regionDistrict + ' ' : archiveAddress;
    archiveAddress =                                archiveAddress + addressInfo?.city + ' ';
    archiveAddress = addressInfo?.cityDistrict ?    archiveAddress + addressInfo?.cityDistrict + ' ' : archiveAddress;
    archiveAddress =                                archiveAddress + addressInfo?.street + ' ';
    archiveAddress = addressInfo?.house ?           archiveAddress + addressInfo?.house + ' ' : archiveAddress;
    archiveAddress = addressInfo?.entrance ?        archiveAddress + addressInfo?.entrance + ' ' : archiveAddress;
    archiveAddress = addressInfo?.floor ?           archiveAddress + addressInfo?.floor + ' ' : archiveAddress;
    archiveAddress = addressInfo?.flat ?            archiveAddress + addressInfo?.flat + ' ' : archiveAddress;
    archiveAddress = addressInfo?.entranceKey ?     archiveAddress + addressInfo?.entranceKey : archiveAddress;
      
    archiveAddress = archiveAddress.trim();
    // Consider: adding new address record to db? Or it will be dangling without userAddress / facility address?
    
    const customerName: string = orderDT.customerName ?
      orderDT.customerName :
      orderDT.user && orderDT.user.name ?
        orderDT.user.name :
        'Anonymous';
    
    const orderItem: OrderItem = {
      orderFoods: preparedOrderFoods,
      deliverAt: new Date(orderDT.deliverAt),
      status,
      totalCost,
      archiveAddress,
      customerPhonenumber: orderDT.customerPhonenumber,
      facility: FacilitySimpleMapper.dtsToSimple(orderDT.facility),
      customerName,
      user: orderDT.user ? UserMapper.dtToDomain(orderDT.user): undefined,
      address: orderDT.address ? AddressMapper.dtToDomain(orderDT.address) : undefined,
      paymentMethod: orderDT.paymentMethod,
      paymentStatus,
      tablewareQuantity: orderDT.tablewareQuantity,
      comment: orderDT.comment
    };

    return orderItem;
  }

  private async aggregateInternalOrderFoodData(orderFoods: OrderFoodDTN[]): Promise<OrderFoodItem[]> {
    // Do not send full food info from the frontend - just id and quantity; The user could change price, for example
    // So, sort the orderFoods by foodId
    const sortedOrderFoods = orderFoods.sort((orderFood1, orderFood2) => orderFood1.foodId - orderFood2.foodId);

    // These are foods retrieved from db
    const sortedChosenFoods = await this.foodRepo.getManySortedByIds(
      sortedOrderFoods.map(orderFood => orderFood.foodId)
    );

    // Aggregate orderFoods with true db food info
    const orderFoodItems: OrderFoodItem[] = [];
    for (let i = 0; i < sortedChosenFoods.length; i++) {
      orderFoodItems.push({
        orderFoodDTN: sortedOrderFoods[i],
        archivePrice: sortedChosenFoods[i].price,
        archiveFoodId: sortedChosenFoods[i].id,
        archiveFoodName: sortedChosenFoods[i].nameLoc.mainStr
      });
    }

    return orderFoodItems;
  }

  async create(orderDTN: OrderDTN): Promise<OrderDT> {
    // Finding facility, user and address are not necessary steps -
    // if they do not exist, an error will be thrown, transaction will be rolled back

    const transaction = await this.transactionHandler.start();

    try {

      // Aggregate order food data
      const orderFoodItems = await this.aggregateInternalOrderFoodData(orderDTN.orderFoods);

      // Create all orderFoods
      const createdOrderFoods = await this.orderFoodRepo.createMany(orderFoodItems, transaction);

      // Aggregate order data
      const newOrderItem = this.aggregateInternalOrderData(
        orderDTN,
        createdOrderFoods,
        OrderStatus.Accepted,
        OrderPaymentStatus.Unpaid
      );

      // Create order
      const createdOrder = await this.orderRepo.create(newOrderItem, transaction);

      await transaction.commit();
      return OrderMapper.domainToDT(createdOrder);
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }

  async update(orderDTU: OrderDTU): Promise<OrderDT> {

    const transaction = await this.transactionHandler.start();

    try {

      let preparedOrderFoods: OrderFood[] = [];

      if (orderDTU.orderFoods) {
        // If order foods are included in update data, do total rewrite of associated orderFoods
        await this.orderFoodRepo.removeByOrderId(orderDTU.id, transaction);

        const orderFoodItems = await this.aggregateInternalOrderFoodData(orderDTU.orderFoods);

        preparedOrderFoods = await this.orderFoodRepo.createMany(orderFoodItems, transaction);
      } else {
        // If order foods are not included in update data, retrieve associated orderFoods from db
        preparedOrderFoods = await this.orderFoodRepo.getAllByOrderId(orderDTU.id);
      }

      // Status is needed here to aggregate data; however, it is not used in the update method
      // To update order status, use updateStatus method
      const orderItem = this.aggregateInternalOrderData(
        orderDTU,
        preparedOrderFoods,
        orderDTU.status,
        orderDTU.paymentStatus
      );
      
      const updatedOrder = await this.orderRepo.update(orderItem, orderDTU.id, transaction);

      await transaction.commit();
      return OrderMapper.domainToDT(updatedOrder);
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }

  async updateStatus(id: number, status?: OrderStatus, paymentStatus?: OrderPaymentStatus): Promise<OrderDT> {

    const transaction = await this.transactionHandler.start();

    try {
      const updatedOrder = await this.orderRepo.updateStatus(id, status, paymentStatus, transaction);

      await transaction.commit();
      return OrderMapper.domainToDT(updatedOrder);
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }

  async remove(id: number): Promise<void> {
    const transaction = await this.transactionHandler.start();

    try {
      await this.orderRepo.remove(id, transaction);
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }

  async removeAll(): Promise<void> {
    if (process.env.NODE_ENV !== 'test') return;
    await this.orderRepo.removeAll();
  }

}