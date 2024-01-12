import type { EntitySimpleMapper } from '../../../utils';
import type { StockDTS } from '@m-cafe-app/models';
import { Stock, StockS } from '@m-cafe-app/models';
import { Stock as StockPG } from '@m-cafe-app/db';


export class StockSimpleMapper implements EntitySimpleMapper<Stock, StockS, StockPG, StockDTS> {

  public static domainToSimple(domainStock: Stock): StockS {
    const stockS = new StockS (
      domainStock.id,
      domainStock.ingredientId,
      domainStock.quantity
    );
    return stockS;
  }

  domainToSimple(domainStock: Stock): StockS {
    return StockSimpleMapper.domainToSimple(domainStock);
  }

  public static dbToSimple(dbStock: StockPG): StockS {
    const stockS = new StockS(
      dbStock.id,
      dbStock.ingredientId,
      dbStock.quantity
    );

    return stockS;
  }

  dbToSimple(dbStock: StockPG): StockS {
    return StockSimpleMapper.dbToSimple(dbStock);
  }

  public static dtsToSimple(stockDTS: StockDTS): StockS {
    const stockS = new StockS (
      stockDTS.id,
      stockDTS.ingredientId,
      stockDTS.quantity
    );
    return stockS;
  }

  dtsToSimple(stockDTS: StockDTS): StockS {
    return StockSimpleMapper.dtsToSimple(stockDTS);
  }

  public static simpleToDTS(stockS: StockS): StockDTS {
    const stockDTS: StockDTS = {
      id: stockS.id,
      ingredientId: stockS.ingredientId,
      quantity: stockS.quantity
    };
    return stockDTS;
  }

  simpleToDTS(stockS: StockS): StockDTS {
    return StockSimpleMapper.simpleToDTS(stockS);
  }

}