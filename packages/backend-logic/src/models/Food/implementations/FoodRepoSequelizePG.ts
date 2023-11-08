import type { IFoodRepo } from '../interfaces';
import type { FoodDTN } from '@m-cafe-app/models';
import type { IDatabaseConnectionHandler } from '@m-cafe-app/db';
import type { Sequelize } from 'sequelize';
import type { ILocStringRepo } from '../../LocString';
import type { IFoodTypeRepo } from '../../FoodType';
import { Food } from '@m-cafe-app/models';
import { Food as FoodPG } from '@m-cafe-app/db';
import { FoodMapper } from '../infrastructure';
import { DatabaseError } from '@m-cafe-app/utils';

export class FoodRepoSequelizePG implements IFoodRepo {

  private dbInstance: Sequelize;

  constructor(
    readonly dbHandler: IDatabaseConnectionHandler,
    readonly locStringRepo: ILocStringRepo,
    readonly foodTypeRepo: IFoodTypeRepo
  ) {
    if (!dbHandler.dbInstance) {
      throw new DatabaseError('No database connection');
    }
    this.dbInstance = dbHandler.dbInstance;
  }

  async getAll(): Promise<Food[]> {
    const dbFoods = await FoodPG.scope('all').findAll();
    return dbFoods.map(food => FoodMapper.dbToDomain(food));
  }

  async getById(id: number): Promise<Food> {
    const dbFood = await FoodPG.scope('allWithTimestamps').findByPk(id);
    if (!dbFood) throw new DatabaseError(`No food type entry with this id ${id}`);
    return FoodMapper.dbToDomain(dbFood);
  }

  async create(foodDTN: FoodDTN): Promise<Food> {
    const createdFood = await this.dbInstance.transaction(async (t) => {
      try {
        const foodType = await this.foodTypeRepo.getById(foodDTN.foodTypeId);

        const nameLoc = await this.locStringRepo.create(foodDTN.nameLoc, t);
        const descriptionLoc = await this.locStringRepo.create(foodDTN.descriptionLoc, t);
  
        const dbFood = await FoodPG.create({
          nameLocId: nameLoc.id,
          descriptionLocId: descriptionLoc.id,
          foodTypeId: foodDTN.foodTypeId,
          price: foodDTN.price
        }, {
          transaction: t
        });
  
        // Not using mapper here because of inability to include returning locs
        // Only other way is to use afterCreate hook for Sequelize
        return new Food(
          dbFood.id,
          nameLoc,
          descriptionLoc,
          foodType,
          dbFood.price
        );
      } catch (err) {
        await t.rollback();
        throw err;
      }
    });

    return createdFood;
  }

  async update(updFood: Food): Promise<Food> {
    const updatedFood = await this.dbInstance.transaction(async (t) => {
      try {

        const [ count, updated ] = await FoodPG.update({
          foodTypeId: updFood.foodType.id,
          price: updFood.price
        }, {
          where: {
            id: updFood.id
          },
          transaction: t,
          returning: true
        });

        if (count === 0) {
          await t.rollback();
          throw new DatabaseError(`No food type entry with this id ${updFood.id}`);
        }

        const updatedFoodType = await this.foodTypeRepo.getById(updFood.foodType.id);

        const updatedNameLoc = await this.locStringRepo.update(updFood.nameLoc, t);
        const updatedDescriptionLoc = await this.locStringRepo.update(updFood.descriptionLoc, t);

        return new Food(
          updated[0].id,
          updatedNameLoc,
          updatedDescriptionLoc,
          updatedFoodType,
          updated[0].price
        );
      } catch (err) {
        await t.rollback();
        throw err;
      }
    });

    return updatedFood;
  }

  async remove(id: number): Promise<void> {
    const dbFood = await FoodPG.scope('raw').findByPk(id);
    if (!dbFood) throw new DatabaseError(`No food type entry with this id ${id}`);

    // Remove loc strings. If needed, add logging of deleted count
    await this.locStringRepo.removeWithCount(dbFood.nameLocId);
    await this.locStringRepo.removeWithCount(dbFood.descriptionLocId);

    await dbFood.destroy();
  }

  async removeAll(): Promise<void> {
    await FoodPG.scope('all').destroy({ force: true, where: {} });
  }
}