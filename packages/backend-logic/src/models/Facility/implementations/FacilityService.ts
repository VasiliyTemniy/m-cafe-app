import type { FacilityDT, FacilityDTN, StockDT, StockDTN } from '@m-cafe-app/models';
import type { IFacilityRepo, IFacilityService } from '../interfaces';
import type { IUserRepo } from '../../User';
import type { IStockRepo } from '../../Stock';
import type { ILocStringRepo } from '../../LocString';
import type { ITransactionHandler } from '../../../utils';
import type { IAddressRepo } from '../../Address';
import { StockMapper } from '../../Stock';
import { FacilityMapper } from '../infrastructure';
import { LocStringMapper } from '../../LocString';

export class FacilityService implements IFacilityService {
  constructor(
    readonly facilityRepo: IFacilityRepo,
    readonly stockRepo: IStockRepo,
    readonly locStringRepo: ILocStringRepo,
    readonly addressRepo: IAddressRepo,
    readonly userRepo: IUserRepo,
    readonly transactionHandler: ITransactionHandler
  ) {}

  async getAll(): Promise<FacilityDT[]> {
    const facilities = await this.facilityRepo.getAll();

    return facilities.map(facility => FacilityMapper.domainToDT(facility));
  }

  async getById(id: number): Promise<FacilityDT> {
    const facility = await this.facilityRepo.getById(id);

    return FacilityMapper.domainToDT(facility);
  }

  async create(facilityDTN: FacilityDTN): Promise<FacilityDT> {
    const transaction = await this.transactionHandler.start();

    try {

      const createdNameLoc = await this.locStringRepo.create(facilityDTN.nameLoc, transaction);
      const createdDescriptionLoc = await this.locStringRepo.create(facilityDTN.descriptionLoc, transaction);

      const { address: foundOrCreatedAddress } = await this.addressRepo.findOrCreate(facilityDTN.address);

      const createdFacility = await this.facilityRepo.create(
        facilityDTN,
        createdNameLoc,
        createdDescriptionLoc,
        foundOrCreatedAddress,
        transaction
      );

      await transaction.commit();
      return FacilityMapper.domainToDT(createdFacility);
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }

  async update(updFacility: FacilityDT): Promise<FacilityDT> {
    const transaction = await this.transactionHandler.start();

    try {

      const oldFacilityData = await this.facilityRepo.getById(updFacility.id);
      
      await this.locStringRepo.update(
        LocStringMapper.dtToDomain(updFacility.nameLoc),
        transaction
      );
      await this.locStringRepo.update(
        LocStringMapper.dtToDomain(updFacility.descriptionLoc),
        transaction
      );

      if (oldFacilityData.address.id !== updFacility.address.id) {
        const { address: foundOrCreatedAsUpdatedAddress } =
        await this.addressRepo.findOrCreate(updFacility.address, transaction);

        await this.facilityRepo.update(
          FacilityMapper.dtToDomain(updFacility),
          foundOrCreatedAsUpdatedAddress.id,
          transaction
        );

        await this.addressRepo.removeIfUnused(oldFacilityData.address.id, transaction);
      }

      await transaction.commit();
      // No need to use FacilityMapper here: loc strings are already updated, address is updated
      return updFacility;
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }

  async remove(id: number): Promise<void> {
    const transaction = await this.transactionHandler.start();

    try {
      const foundFacility = await this.facilityRepo.getById(id);
      await this.facilityRepo.remove(id, transaction);
      await this.locStringRepo.removeWithCount([foundFacility.nameLoc.id, foundFacility.descriptionLoc.id], transaction);
      await this.addressRepo.removeIfUnused(foundFacility.address.id, transaction);
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }

  async removeAll(): Promise<void> {
    if (process.env.NODE_ENV !== 'test') return;
    await this.facilityRepo.removeAll();
  }

  async getAllWithFullData(): Promise<FacilityDT[]> {
    const facilities = await this.facilityRepo.getAllWithFullData();

    return facilities.map(facility => FacilityMapper.domainToDT(facility));
  }

  async getByIdWithFullData(id: number): Promise<FacilityDT> {
    const facility = await this.facilityRepo.getByIdWithFullData(id);

    return FacilityMapper.domainToDT(facility);
  }

  async getAllWithStocks(): Promise<FacilityDT[]> {
    const facilities = await this.facilityRepo.getAllWithStocks();

    return facilities.map(facility => FacilityMapper.domainToDT(facility));
  }

  async getByIdWithStocks(id: number): Promise<FacilityDT> {
    const facility = await this.facilityRepo.getByIdWithStocks(id);

    return FacilityMapper.domainToDT(facility);
  }

  async getStocksByFacilityId(id: number): Promise<StockDT[]> {
    const stocks = await this.stockRepo.getByFacilityId(id);

    return stocks.map(stock => StockMapper.domainToDT(stock));
  }

  async createStock(stockDTN: StockDTN): Promise<StockDT> {
    const createdStock = await this.stockRepo.create(stockDTN);

    return StockMapper.domainToDT(createdStock);
  }

  async createManyStocks(stockDTNs: StockDTN[]): Promise<StockDT[]> {
    const createdStocks = await this.stockRepo.createMany(stockDTNs);

    return createdStocks.map(stock => StockMapper.domainToDT(stock));
  }

  async updateStock(stock: StockDT): Promise<StockDT> {
    const updatedStock = await this.stockRepo.update(StockMapper.dtToDomain(stock));

    return StockMapper.domainToDT(updatedStock);
  }

  async updateManyStocks(stocks: StockDT[]): Promise<StockDT[]> {
    const updatedStocks = await this.stockRepo.updateMany(stocks.map(stock => StockMapper.dtToDomain(stock)));

    return updatedStocks.map(stock => StockMapper.domainToDT(stock));
  }

  async removeStock(id: number): Promise<void> {
    await this.stockRepo.remove(id);
  }

  async removeManyStocks(ids: number[]): Promise<void> {
    await this.stockRepo.removeWithCount(ids);
  }

  async removeAllStocks(): Promise<void> {
    if (process.env.NODE_ENV !== 'test') return;
    await this.stockRepo.removeAll();
  }

  async getAllWithManagers(): Promise<FacilityDT[]> {
    const facilities = await this.facilityRepo.getAllWithManagers();

    return facilities.map(facility => FacilityMapper.domainToDT(facility));
  }

  async getByIdWithManagers(id: number): Promise<FacilityDT> {
    const facility = await this.facilityRepo.getByIdWithManagers(id);

    return FacilityMapper.domainToDT(facility);
  }

  async checkFacilityManager(facilityId: number, userId: number): Promise<boolean> {
    return await this.facilityRepo.checkFacilityManager(facilityId, userId);
  }

  async addManagers(facilityId: number, managerIds: number[]): Promise<FacilityDT> {
    const managers = managerIds.map(userId => ({
      facilityId,
      userId
    }));

    const transaction = await this.transactionHandler.start();

    try {
      await this.facilityRepo.addManagers(managers, transaction);

      await this.userRepo.changeRightsBulk(managerIds, 'manager', transaction);
  
      const facilityDT = await this.getByIdWithManagers(facilityId);
  
      await transaction.commit();
      return facilityDT;
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }

  async removeManagers(facilityId: number, managerIds: number[]): Promise<FacilityDT> {
    const managers = managerIds.map(userId => ({
      facilityId,
      userId
    }));

    const transaction = await this.transactionHandler.start();

    try {
      await this.facilityRepo.removeManagers(managers);

      await this.userRepo.changeRightsBulk(managerIds, 'customer', transaction);

      const facilityDT = await this.getByIdWithManagers(facilityId);
  
      await transaction.commit();
      return facilityDT;
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }
}