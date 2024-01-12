import type { OrderFood } from '@m-cafe-app/models';
import type { IOrderFoodRepo, OrderFoodItem } from '../interfaces';
import type { Transaction } from 'sequelize';
import { OrderFood as OrderFoodPG } from '@m-cafe-app/db';
import { OrderFoodMapper } from '../infrastructure';
import { DatabaseError } from '@m-cafe-app/utils';



export class OrderFoodRepoSequelizePG implements IOrderFoodRepo {

  async getById(id: number): Promise<OrderFood> {
    const dbOrderFood = await OrderFoodPG.findByPk(id);
    if (!dbOrderFood) throw new Error(`No order food entry with this id ${id}`);
    return OrderFoodMapper.dbToDomain(dbOrderFood);
  }

  async getAllByOrderId(orderId: number): Promise<OrderFood[]> {
    const dbOrderFoods = await OrderFoodPG.findAll({ where: { orderId } });
    return dbOrderFoods.map(orderFood => OrderFoodMapper.dbToDomain(orderFood));
  }

  async create(
    item: OrderFoodItem,
    transaction?: Transaction
  ): Promise<OrderFood> {
    
    const dbOrderFood = await OrderFoodPG.create({
      orderId: item.orderFoodDTN.orderId,
      archiveFoodId: item.archiveFoodId,
      quantity: item.orderFoodDTN.quantity,
      archivePrice: item.archivePrice,
      archiveFoodName: item.archiveFoodName
    }, {
      transaction
    });

    return OrderFoodMapper.dbToDomain(dbOrderFood);
  }

  async createMany(
    items: OrderFoodItem[],
    transaction?: Transaction
  ): Promise<OrderFood[]> {
      
    const dbOrderFoods = await OrderFoodPG.bulkCreate(items.map(item => ({
      orderId: item.orderFoodDTN.orderId,
      archiveFoodId: item.archiveFoodId,
      quantity: item.orderFoodDTN.quantity,
      archivePrice: item.archivePrice,
      archiveFoodName: item.archiveFoodName
    })), {
      transaction
    });

    return dbOrderFoods.map(dbOrderFood => OrderFoodMapper.dbToDomain(dbOrderFood));
  }

  /**
   * Changes only the quantity, to change other fields delete the record and create a new
   */
  async update(
    updOrderFood: OrderFood,
    transaction?: Transaction
  ): Promise<OrderFood> {
    
    const [ count, updated ] = await OrderFoodPG.update({
      quantity: updOrderFood.quantity
    }, {
      where: {
        orderId: updOrderFood.orderId,
        archiveFoodId: updOrderFood.archiveFoodId
      },
      transaction,
      returning: true
    });

    if (count === 0) {
      throw new DatabaseError(`No order food entry with these ids: order id: ${updOrderFood.orderId}, food id: ${updOrderFood.archiveFoodId}`);
    }

    return OrderFoodMapper.dbToDomain(updated[0]);
  }

  async remove(orderId: number, archiveFoodId: number, transaction?: Transaction): Promise<void> {
    const count = await OrderFoodPG.destroy({
      where: {
        orderId,
        archiveFoodId
      },
      transaction
    });

    if (count === 0) {
      throw new DatabaseError(`No order food entry with these ids: order id: ${orderId}, food id: ${archiveFoodId}`);
    }
  }

  async removeByOrderId(orderId: number, transaction?: Transaction): Promise<number> {
    const count = await OrderFoodPG.destroy({
      where: {
        orderId
      },
      transaction
    });

    return count;
  }

  async removeAll(): Promise<void> {
    await OrderFoodPG.destroy({ where: {} });
  }

}