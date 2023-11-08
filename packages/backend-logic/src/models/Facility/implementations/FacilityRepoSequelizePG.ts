import type { IFacilityRepo } from '../interfaces';
import type { FacilityDTN } from '@m-cafe-app/models';
import type { IDatabaseConnectionHandler } from '@m-cafe-app/db';
import type { Sequelize } from 'sequelize';
import type { ILocStringRepo } from '../../LocString';
import type { IAddressRepo } from '../../Address';
import { Facility } from '@m-cafe-app/models';
import { Facility as FacilityPG } from '@m-cafe-app/db';
import { FacilityMapper } from '../infrastructure';
import { DatabaseError } from '@m-cafe-app/utils';

export class FacilityRepoSequelizePG implements IFacilityRepo {

  private dbInstance: Sequelize;

  constructor(
    readonly dbHandler: IDatabaseConnectionHandler,
    readonly locStringRepo: ILocStringRepo,
    readonly addressRepo: IAddressRepo
  ) {
    if (!dbHandler.dbInstance) {
      throw new DatabaseError('No database connection');
    }
    this.dbInstance = dbHandler.dbInstance;
  }

  async getAll(): Promise<Facility[]> {
    const dbFacilitys = await FacilityPG.scope('all').findAll();
    return dbFacilitys.map(facility => FacilityMapper.dbToDomain(facility));
  }

  async getById(id: number): Promise<Facility> {
    const dbFacility = await FacilityPG.scope('allWithTimestamps').findByPk(id);
    if (!dbFacility) throw new DatabaseError(`No facility entry with this id ${id}`);
    return FacilityMapper.dbToDomain(dbFacility);
  }

  async create(facilityDTN: FacilityDTN): Promise<Facility> {
    const createdFacility = await this.dbInstance.transaction(async (t) => {
      try {
        const nameLoc = await this.locStringRepo.create(facilityDTN.nameLoc, t);
        const descriptionLoc = await this.locStringRepo.create(facilityDTN.descriptionLoc, t);

        const { address } = await this.addressRepo.create(facilityDTN.address, t);

        const dbFacility = await FacilityPG.create({
          nameLocId: nameLoc.id,
          descriptionLocId: descriptionLoc.id,
          addressId: address.id
        });

        // Not using mapper here because of inability to include returning locs
        // Only other way is to use afterCreate hook for Sequelize
        return new Facility(
          dbFacility.id,
          nameLoc,
          descriptionLoc,
          address
        );
      } catch (err) {
        await t.rollback();
        throw err;
      }
    });

    return createdFacility;
  }

  async update(updFacility: Facility): Promise<Facility> {
    const updatedFacility = await this.dbInstance.transaction(async (t) => {

      const dbFacility = await FacilityPG.scope('raw').findByPk(updFacility.id);
      if (!dbFacility) {
        await t.rollback();
        throw new DatabaseError(`No facility entry with this id ${updFacility.id}`);
      }
  
      try {
        const updatedNameLoc = await this.locStringRepo.update(updFacility.nameLoc, t);
        const updatedDescriptionLoc = await this.locStringRepo.update(updFacility.descriptionLoc, t);

        const { address: updatedAddress } = await this.addressRepo.update(updFacility.address, t);
  
        return new Facility(
          updFacility.id,
          updatedNameLoc,
          updatedDescriptionLoc,
          updatedAddress
        );
      } catch (err) {
        await t.rollback();
        throw err;
      }
    });

    return updatedFacility;
  }

  async remove(id: number): Promise<void> {
    const dbFacility = await FacilityPG.scope('raw').findByPk(id);
    if (!dbFacility) throw new DatabaseError(`No facility entry with this id ${id}`);

    // Remove loc strings. If needed, add logging of deleted count
    await this.locStringRepo.removeWithCount(dbFacility.nameLocId);
    await this.locStringRepo.removeWithCount(dbFacility.descriptionLocId);

    await this.addressRepo.removeIfUnused(dbFacility.addressId);

    await dbFacility.destroy();
  }

  async removeAll(): Promise<void> {
    await FacilityPG.scope('all').destroy({ force: true, where: {} });
  }
}