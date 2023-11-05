import type { IFoodTypeRepo } from '../interfaces';
import type { FoodTypeDTN } from '@m-cafe-app/models';
import type { IDatabaseConnectionHandler } from '@m-cafe-app/db';
import type { Sequelize } from 'sequelize';
import type { ILocStringRepo } from '../../LocString';
import { FoodType } from '@m-cafe-app/models';
import { FoodType as FoodTypePG, LocString as LocStringPG } from '@m-cafe-app/db';
import { FoodTypeMapper } from '../infrastructure';
import { DatabaseError } from '@m-cafe-app/utils';

export class FoodTypeRepoSequelizePG implements IFoodTypeRepo {

  private dbInstance: Sequelize;

  constructor(
    readonly dbHandler: IDatabaseConnectionHandler,
    readonly locStringRepo: ILocStringRepo
  ) {
    if (!dbHandler.dbInstance) {
      throw new DatabaseError('No database connection');
    }
    this.dbInstance = dbHandler.dbInstance;
  }

  async getAll(): Promise<FoodType[]> {
    const dbFoodTypes = await FoodTypePG.scope('all').findAll();
    return dbFoodTypes.map(foodType => FoodTypeMapper.dbToDomain(foodType));
  }

  async getById(id: number): Promise<FoodType> {
    const dbFoodType = await FoodTypePG.scope('allWithTimestamps').findByPk(id);
    if (!dbFoodType) throw new DatabaseError(`No food type entry with this id ${id}`);
    return FoodTypeMapper.dbToDomain(dbFoodType);
  }

  async create(foodTypeDTN: FoodTypeDTN): Promise<FoodType> {

    const dbNameLoc = await this.locStringRepo.create(foodTypeDTN.nameLoc);
    const dbDescriptionLoc = await this.locStringRepo.create(foodTypeDTN.descriptionLoc);

    const dbFoodType = await FoodTypePG.create({
      nameLocId: dbNameLoc.id,
      descriptionLocId: dbDescriptionLoc.id
    });

    // Not using mapper here because of inability to include returning locs
    // Only other way is to use afterCreate hook for Sequelize
    return new FoodType(
      dbFoodType.id,
      dbNameLoc,
      dbDescriptionLoc
    );
  }

  async update(updFoodType: FoodType): Promise<FoodType> {

    const updatedFoodType = await this.dbInstance.transaction(async (t) => {

      const dbFoodType = await FoodTypePG.scope('raw').findByPk(updFoodType.id);
      if (!dbFoodType) {
        await t.rollback();
        throw new DatabaseError(`No food type entry with this id ${updFoodType.id}`);
      }
  
      try {
        const updatedNameLoc = await this.locStringRepo.update(updFoodType.nameLoc);
        const updatedDescriptionLoc = await this.locStringRepo.update(updFoodType.descriptionLoc);
  
        return new FoodType(
          updFoodType.id,
          updatedNameLoc,
          updatedDescriptionLoc,
        );
      } catch (err) {
        await t.rollback();
        throw err;
      }
    });

    return updatedFoodType;
  }

  async remove(id: number): Promise<void> {
    const dbFoodType = await FoodTypePG.scope('raw').findByPk(id);
    if (!dbFoodType) throw new DatabaseError(`No food type entry with this id ${id}`);

    await LocStringPG.scope('all').destroy({ where: { id: dbFoodType.nameLocId } });
    await LocStringPG.scope('all').destroy({ where: { id: dbFoodType.descriptionLocId } });

    await dbFoodType.destroy();
  }

  async removeAll(): Promise<void> {
    await FoodTypePG.scope('all').destroy({ force: true, where: {} });
  }
}