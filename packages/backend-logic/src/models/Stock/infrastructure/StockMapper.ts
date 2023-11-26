import type { EntityDBMapper, EntityDTMapper } from '../../../utils';
import type { StockDT } from '@m-cafe-app/models';
import { Stock } from '@m-cafe-app/models';
import { Stock as StockPG } from '@m-cafe-app/db';
import { toOptionalISOString } from '@m-cafe-app/utils';


export class StockMapper implements EntityDBMapper<Stock, StockPG>, EntityDTMapper<Stock, StockDT> {

  public static dbToDomain(dbStock: StockPG): Stock {
    const domainStock = new Stock(
      dbStock.id,
      dbStock.ingredientId,
      dbStock.facilityId,
      dbStock.quantity,
      dbStock.createdAt,
      dbStock.updatedAt
    );
    return domainStock;
  }

  dbToDomain(dbStock: StockPG): Stock {
    return StockMapper.dbToDomain(dbStock);
  }

  public static dtToDomain(stockDT: StockDT): Stock {
    const domainStock = new Stock(
      stockDT.id,
      stockDT.ingredientId,
      stockDT.facilityId,
      stockDT.quantity,
      // timestamps are not accepted from frontend
      // toOptionalDate(stockDT.createdAt),
      // toOptionalDate(stockDT.updatedAt)
    );
    return domainStock;
  }
  
  dtToDomain(stockDT: StockDT): Stock {
    return StockMapper.dtToDomain(stockDT);
  }

  public static domainToDT(domainStock: Stock): StockDT {
    const stockDT: StockDT = {
      id: domainStock.id,
      ingredientId: domainStock.ingredientId,
      facilityId: domainStock.facilityId,
      quantity: domainStock.quantity,
      createdAt: toOptionalISOString(domainStock.createdAt),
      updatedAt: toOptionalISOString(domainStock.updatedAt)
    };
    return stockDT;
  }

  domainToDT(domainStock: Stock): StockDT {
    return StockMapper.domainToDT(domainStock);
  }

}