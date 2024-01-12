import type { Stock, StockDTN } from '@m-market-app/models';
import type { GenericTransaction, ICRUDRepo } from '../../../utils';


export interface IStockRepo extends ICRUDRepo<Stock, StockDTN> {
  createMany(stockDTNs: StockDTN[], transaction?: GenericTransaction): Promise<Stock[]>
  updateMany(stocks: Stock[], transaction?: GenericTransaction): Promise<Stock[]>
  getByFacilityId(facilityId: number): Promise<Stock[]>
  removeWithCount(ids: number[], transaction?: GenericTransaction): Promise<number>
}