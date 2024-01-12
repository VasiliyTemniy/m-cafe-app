import type { IOrderRepo, OrderItem } from '../interfaces';
import type { Transaction } from 'sequelize';
import type { OrderPaymentStatus, OrderStatus } from '@m-market-app/shared-constants';
import { Order } from '@m-market-app/models';
import { Order as OrderPG } from '@m-market-app/db';
import { OrderMapper } from '../infrastructure';
import { DatabaseError } from '@m-market-app/utils';


export class OrderRepoSequelizePG implements IOrderRepo {

  async getAll(): Promise<Order[]> {
    const dbOrders = await OrderPG.scope('allWithFullData').findAll();
    return dbOrders.map(order => OrderMapper.dbToDomain(order));
  }

  async getById(id: number): Promise<Order> {
    const dbOrder = await OrderPG.scope('allWithTimestamps').findByPk(id);
    if (!dbOrder) throw new DatabaseError(`No order entry with this id ${id}`);
    return OrderMapper.dbToDomain(dbOrder);
  }

  async getSome(limit: number, offset: number, userId?: number, status?: string, facilityId?: number): Promise<Order[]> {

    let where = {};

    if (userId) where = { ...where, userId };
    if (status) where = { ...where, status };
    if (facilityId) where = { ...where, facilityId };

    const dbOrders = await OrderPG.scope('allWithFullData').findAll({
      where,
      limit,
      offset,
      order: [
        ['createdAt', 'DESC']
      ]
    });
    return dbOrders.map(order => OrderMapper.dbToDomain(order));
  }

  async create(
    item: OrderItem,
    transaction?: Transaction
  ): Promise<Order> {
  
    const dbOrder = await OrderPG.create({
      deliverAt: item.deliverAt,
      status: item.status,
      totalCost: item.totalCost,
      archiveAddress: item.archiveAddress,
      customerPhonenumber: item.customerPhonenumber,
      facilityId: item.facility.id,
      customerName: item.customerName,
      addressId: item.address ? item.address.id : undefined,
      userId: item.user ? item.user.id : undefined,
      paymentMethod: item.paymentMethod,
      paymentStatus: item.paymentStatus,
      tablewareQuantity: item.tablewareQuantity,
      comment: item.comment
    }, {
      transaction
    });
  
    return new Order(
      dbOrder.id,
      dbOrder.deliverAt,
      dbOrder.status,
      item.orderFoods,
      item.facility,
      dbOrder.totalCost,
      dbOrder.archiveAddress,
      dbOrder.customerPhonenumber,
      dbOrder.customerName,
      dbOrder.paymentMethod,
      dbOrder.paymentStatus,
      dbOrder.tablewareQuantity,
      dbOrder.comment ? dbOrder.comment : undefined,
      item.user,
      item.address
    );
  }

  async update(updItem: OrderItem, orderId: number, transaction?: Transaction): Promise<Order> {

    const [ count, updated ] = await OrderPG.scope('allWithFullData').update({
      deliverAt: updItem.deliverAt,
      // status: updItem.status, // Status is updated in separate updateStatus method
      totalCost: updItem.totalCost,
      archiveAddress: updItem.archiveAddress,
      customerPhonenumber: updItem.customerPhonenumber,
      customerName: updItem.customerName,
      addressId: updItem.address ? updItem.address.id : undefined,
      userId: updItem.user ? updItem.user.id : undefined,
      paymentMethod: updItem.paymentMethod,
      // paymentStatus: updItem.paymentStatus, // Status is updated in separate updateStatus method
      tablewareQuantity: updItem.tablewareQuantity,
      comment: updItem.comment
    }, {
      where: { id: orderId },
      transaction,
      returning: true
    });

    if (count === 0) {
      throw new DatabaseError(`No order entry with this id ${orderId}`);
    }

    return OrderMapper.dbToDomain(updated[0]);
  }

  async updateStatus(
    orderId: number,
    status?: OrderStatus,
    paymentStatus?: OrderPaymentStatus,
    transaction?: Transaction
  ): Promise<Order> {

    let updateFields: Partial<OrderItem> = {};

    if (status) {
      updateFields = { ...updateFields, status };
    }

    if (paymentStatus) {
      updateFields = { ...updateFields, paymentStatus };
    }

    const [ count, updated ] = await OrderPG.scope('allWithFullData').update(updateFields, {
      where: { id: orderId },
      transaction,
      returning: true
    });

    if (count === 0) {
      throw new DatabaseError(`No order entry with this id ${orderId}`);
    }

    return OrderMapper.dbToDomain(updated[0]);
  }

  async remove(id: number, transaction?: Transaction): Promise<void> {
    const dbOrder = await OrderPG.scope('raw').findByPk(id);
    if (!dbOrder) throw new DatabaseError(`No order type entry with this id ${id}`);
    await dbOrder.destroy({ transaction });
  }

  async removeAll(): Promise<void> {
    await OrderPG.scope('all').destroy({ where: {} });
  }
}