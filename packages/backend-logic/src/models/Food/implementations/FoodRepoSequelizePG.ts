import type { IFoodRepo } from '../interfaces';
import type { FoodDTN } from '@m-cafe-app/models';
import type { IDatabaseConnectionHandler } from '@m-cafe-app/db';
import type { Sequelize } from 'sequelize';
import type { ILocStringRepo } from '../../LocString';
import { Food } from '@m-cafe-app/models';
import { Food as FoodPG, LocString as LocStringPG, FoodType as FoodTypePG } from '@m-cafe-app/db';
import { FoodMapper } from '../infrastructure';
import { DatabaseError } from '@m-cafe-app/utils';
import { FoodTypeMapper } from '../../FoodType';

export class FoodRepoSequelizePG implements IFoodRepo {

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

    const existingFoodType = await FoodTypePG.scope('all').findByPk(foodDTN.foodTypeId);
    if (!existingFoodType) throw new DatabaseError(`No food type entry with this id ${foodDTN.foodTypeId}`); 

    const dbNameLoc = await this.locStringRepo.create(foodDTN.nameLoc);
    const dbDescriptionLoc = await this.locStringRepo.create(foodDTN.descriptionLoc);

    const dbFood = await FoodPG.create({
      nameLocId: dbNameLoc.id,
      descriptionLocId: dbDescriptionLoc.id,
      foodTypeId: foodDTN.foodTypeId,
      price: foodDTN.price
    });

    // Not using mapper here because of inability to include returning locs
    // Only other way is to use afterCreate hook for Sequelize
    return new Food(
      dbFood.id,
      dbNameLoc,
      dbDescriptionLoc,
      FoodTypeMapper.dbToDomain(existingFoodType),
      dbFood.price
    );
  }

  async update(updFood: Food): Promise<Food> {
    const updatedFood = await this.dbInstance.transaction(async (t) => {

      const dbFood = await FoodPG.scope('all').findByPk(updFood.id);
      if (!dbFood) {
        await t.rollback();
        throw new DatabaseError(`No food entry with this id ${updFood.id}`);
      }
      if (!dbFood.foodType) {
        await t.rollback();
        throw new DatabaseError(`No food type entry with this id ${dbFood.foodTypeId}`);
      }

      try {

        if (updFood.foodType.id !== dbFood.foodTypeId) {
          const updatedFoodType = await FoodTypePG.scope('all').findByPk(updFood.foodType.id);
          if (!updatedFoodType) {
            await t.rollback();
            throw new DatabaseError(`No food type entry with this id ${updFood.foodType.id}`);
          }
  
          dbFood.foodTypeId = updFood.foodType.id;
          dbFood.foodType = updatedFoodType;
          await dbFood.save({ transaction: t });
        }

        const updatedNameLoc = await this.locStringRepo.update(updFood.nameLoc);
        const updatedDescriptionLoc = await this.locStringRepo.update(updFood.descriptionLoc);

        return new Food(
          updFood.id,
          updatedNameLoc,
          updatedDescriptionLoc,
          FoodTypeMapper.dbToDomain(dbFood.foodType),
          updFood.price
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

    await LocStringPG.scope('all').destroy({ where: { id: dbFood.nameLocId } });
    await LocStringPG.scope('all').destroy({ where: { id: dbFood.descriptionLocId } });

    await dbFood.destroy();
  }

  async removeAll(): Promise<void> {
    await FoodPG.scope('all').destroy({ force: true, where: {} });
  }
}