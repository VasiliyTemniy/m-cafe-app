import type { IStockRepo } from '../interfaces';
import type { StockDTN } from '@m-cafe-app/models';
import type { Transaction } from 'sequelize';
import { Stock } from '@m-cafe-app/models';
import { Stock as StockPG } from '@m-cafe-app/db';
import { StockMapper } from '../infrastructure';
import { DatabaseError } from '@m-cafe-app/utils';

export class StockRepoSequelizePG implements IStockRepo {

  async getAll(): Promise<Stock[]> {
    const dbStocks = await StockPG.scope('all').findAll();
    return dbStocks.map(stock => StockMapper.dbToDomain(stock));
  }

  async getById(id: number): Promise<Stock> {
    const dbStock = await StockPG.scope('allWithTimestamps').findByPk(id);
    if (!dbStock) throw new DatabaseError(`No stock entry with this id ${id}`);
    return StockMapper.dbToDomain(dbStock);
  }

  async getByFacilityId(facilityId: number): Promise<Stock[]> {
    const dbStocks = await StockPG.scope('all').findAll({
      where: {
        facilityId
      }
    });

    return dbStocks.map(stock => StockMapper.dbToDomain(stock));
  }

  async create(stockDTN: StockDTN, transaction?: Transaction): Promise<Stock> {
    const dbStock = await StockPG.create(stockDTN, {
      transaction
    });

    return StockMapper.dbToDomain(dbStock);
  }

  async createMany(stockDTNs: StockDTN[], transaction?: Transaction): Promise<Stock[]> {
    const dbStocks = await StockPG.bulkCreate(stockDTNs, {
      transaction
    });

    return dbStocks.map(stock => StockMapper.dbToDomain(stock));
  }

  async update(updStock: Stock, transaction?: Transaction): Promise<Stock> {
    const [ count, updated ] = await StockPG.update({
      quantity: updStock.quantity
    }, {
      transaction,
      where: {
        id: updStock.id
      },
      returning: true
    });

    if (count === 0) {
      throw new DatabaseError(`No stock entry with this id ${updStock.id}`);
    }

    return StockMapper.dbToDomain(updated[0]);
  }

  async updateMany(stocks: Stock[], transaction?: Transaction): Promise<Stock[]> {
    const updated = await Promise.all(stocks.map(async stock => {
      return await this.update(stock, transaction);
    }));

    return updated;
  }

  async remove(id: number, transaction?: Transaction): Promise<void> {
    const dbStock = await StockPG.scope('raw').findByPk(id);
    if (!dbStock) throw new DatabaseError(`No stock entry with this id ${id}`);

    await dbStock.destroy({ transaction });
  }

  async removeWithCount(ids: number[], transaction?: Transaction): Promise<number> {
    return await StockPG.scope('raw').destroy({ where: { id: ids }, transaction });
  }

  async removeAll(): Promise<void> {
    await StockPG.scope('all').destroy({ force: true, where: {} });
  }
}