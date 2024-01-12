import type { FacilityDT, FacilityDTN, StockDT, StockDTN } from '@m-market-app/models';
import type { ICRUDService } from '../../../utils';

export interface IFacilityService extends ICRUDService<FacilityDT, FacilityDTN> {
  getAllWithFullData(): Promise<FacilityDT[]>;
  getByIdWithFullData(id: number): Promise<FacilityDT>;
  getAllWithStocks(): Promise<FacilityDT[]>;
  getByIdWithStocks(id: number): Promise<FacilityDT>;
  createStock(stockDTN: StockDTN): Promise<StockDT>;
  createManyStocks(stockDTNs: StockDTN[]): Promise<StockDT[]>;
  updateStock(stock: StockDT): Promise<StockDT>;
  updateManyStocks(stocks: StockDT[]): Promise<StockDT[]>;
  removeStock(id: number): Promise<void>;
  removeManyStocks(ids: number[]): Promise<void>;
  removeAllStocks(): Promise<void>;
  getAllWithManagers(): Promise<FacilityDT[]>;
  getByIdWithManagers(id: number): Promise<FacilityDT>;
  checkFacilityManager(facilityId: number, userId: number): Promise<boolean>;
  addManagers(facilityId: number, managerIds: number[]): Promise<FacilityDT>;
  removeManagers(facilityId: number, managerIds: number[]): Promise<FacilityDT>;
}