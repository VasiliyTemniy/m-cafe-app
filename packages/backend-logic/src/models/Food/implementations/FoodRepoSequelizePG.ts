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

    const existingFoodType = await FoodTypePG.scope('raw').findByPk(foodDTN.foodTypeId);
    if (!existingFoodType) throw new DatabaseError(`No food type entry with this id ${foodDTN.foodTypeId}`); 

    const dbNameLoc = await this.locStringRepo.create(foodDTN.nameLoc);
    const dbDescriptionLoc = await this.locStringRepo.create(foodDTN.descriptionLoc);

    const dbFood = await FoodPG.create({
      nameLocId: dbNameLoc.id,
      descriptionLocId: dbDescriptionLoc.id,
      foodTypeId: foodDTN.foodTypeId,
      price: foodDTN.price
    });

    return FoodMapper.dbToDomain(dbFood);
  }

  async update(updFood: Food): Promise<Food> {
    const updatedFoodType = await this.dbInstance.transaction(async (t) => {

      const dbFood = await FoodPG.scope('raw').findByPk(updFood.id);
      if (!dbFood) {
        await t.rollback();
        throw new DatabaseError(`No food entry with this id ${updFood.id}`);
      }

      // Check for existence of updated food type
      const updatedFoodType = await FoodTypePG.scope('raw').findByPk(updFood.foodType.id);
      if (!updatedFoodType) throw new DatabaseError(`No food type entry with this id ${updFood.foodType.id}`); 

      const updatedNameLoc = await this.locStringRepo.update(updFood.nameLoc);

      const updatedDescriptionLoc = await this.locStringRepo.update(updFood.descriptionLoc);

      return new Food(
        updFood.id,
        updatedNameLoc,
        updatedDescriptionLoc,
        FoodTypeMapper.dbToDomain(updatedFoodType),
        updFood.price
      );
    });

    return updatedFoodType;
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