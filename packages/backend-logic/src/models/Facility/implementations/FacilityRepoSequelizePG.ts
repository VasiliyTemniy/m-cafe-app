import type { IFacilityRepo } from '../interfaces';
import type { FacilityDTN, LocString, Address } from '@m-cafe-app/models';
import type { Transaction } from 'sequelize';
import { Facility } from '@m-cafe-app/models';
import { Facility as FacilityPG, FacilityManager as FacilityManagerPG } from '@m-cafe-app/db';
import { FacilityMapper } from '../infrastructure';
import { DatabaseError } from '@m-cafe-app/utils';

export class FacilityRepoSequelizePG implements IFacilityRepo {

  async getAll(): Promise<Facility[]> {
    const dbFacilities = await FacilityPG.scope('all').findAll();
    return dbFacilities.map(facility => FacilityMapper.dbToDomain(facility));
  }

  async getById(id: number): Promise<Facility> {
    const dbFacility = await FacilityPG.scope('allWithTimestamps').findByPk(id);
    if (!dbFacility) throw new DatabaseError(`No facility entry with this id ${id}`);
    return FacilityMapper.dbToDomain(dbFacility);
  }

  async create(
    facilityDTN: FacilityDTN,
    nameLoc: LocString,
    descriptionLoc: LocString,
    address: Address,
    transaction?: Transaction
  ): Promise<Facility> {

    const dbFacility = await FacilityPG.create({
      nameLocId: nameLoc.id,
      descriptionLocId: descriptionLoc.id,
      addressId: address.id
    }, {
      transaction
    });

    return new Facility(
      dbFacility.id,
      nameLoc,
      descriptionLoc,
      address
    );
  }

  async update(updFacility: Facility, updAddressId: number, transaction?: Transaction): Promise<Facility> {

    const [ count, updated ] = await FacilityPG.update({
      addressId: updAddressId,
    }, {
      where: { id: updFacility.id },
      transaction,
      returning: true
    });

    if (count === 0) {
      throw new DatabaseError(`No facility entry with this id ${updFacility.id}`);
    }
  
    // Loc strings are already updated here
    return FacilityMapper.dbToDomain(updated[0]);
  }

  async remove(id: number, transaction?: Transaction): Promise<void> {
    const dbFacility = await FacilityPG.scope('raw').findByPk(id);
    if (!dbFacility) throw new DatabaseError(`No facility entry with this id ${id}`);

    // Remove loc strings. If needed, add logging of deleted count
    // await this.locStringRepo.removeWithCount([dbFacility.nameLocId]);
    // await this.locStringRepo.removeWithCount([dbFacility.descriptionLocId]);

    // await this.addressRepo.removeIfUnused(dbFacility.addressId);

    await dbFacility.destroy({ transaction });
  }

  async removeAll(): Promise<void> {
    await FacilityPG.scope('all').destroy({ force: true, where: {} });
  }

  async getAllWithFullData(): Promise<Facility[]> {
    const dbFacilities = await FacilityPG.scope('allWithFullData').findAll();
    return dbFacilities.map(facility => FacilityMapper.dbToDomain(facility));
  }

  async getByIdWithFullData(id: number): Promise<Facility> {
    const dbFacility = await FacilityPG.scope('allWithFullData').findByPk(id);
    if (!dbFacility) throw new DatabaseError(`No facility entry with this id ${id}`);
    return FacilityMapper.dbToDomain(dbFacility);
  }

  async getAllWithStocks(): Promise<Facility[]> {
    const dbFacilities = await FacilityPG.scope('allWithStocks').findAll();
    return dbFacilities.map(facility => FacilityMapper.dbToDomain(facility));
  }

  async getByIdWithStocks(id: number): Promise<Facility> {
    const dbFacility = await FacilityPG.scope('allWithStocks').findByPk(id);
    if (!dbFacility) throw new DatabaseError(`No facility entry with this id ${id}`);
    return FacilityMapper.dbToDomain(dbFacility);
  }

  async getAllWithManagers(): Promise<Facility[]> {
    const dbFacilities = await FacilityPG.scope('allWithManagers').findAll();
    return dbFacilities.map(facility => FacilityMapper.dbToDomain(facility));
  }

  async getByIdWithManagers(id: number): Promise<Facility> {
    const dbFacility = await FacilityPG.scope('allWithManagers').findByPk(id);
    if (!dbFacility) throw new DatabaseError(`No facility entry with this id ${id}`);
    return FacilityMapper.dbToDomain(dbFacility);
  }

  async checkFacilityManager(facilityId: number, userId: number): Promise<boolean> {
    const foundFacilityManager = await FacilityManagerPG.findOne({
      where: { facilityId, userId }
    });

    return !!foundFacilityManager;
  }

  async addManagers(
    addManagersData: Array<{ facilityId: number, userId: number }>,
    transaction?: Transaction
  ): Promise<number> {
    const dbManagers = await FacilityManagerPG.bulkCreate(addManagersData, {
      transaction
    });

    if (dbManagers.length !== addManagersData.length) {
      throw new DatabaseError(`Failed to add ${addManagersData.length - dbManagers.length} managers`);
    }

    return dbManagers.length;
  }

  async removeManagers(
    removeManagersData: Array<{ facilityId: number, userId: number }>,
    transaction?: Transaction
  ): Promise<number> {
    return await FacilityManagerPG.destroy({
      where: removeManagersData,
      transaction
    });
  }
}