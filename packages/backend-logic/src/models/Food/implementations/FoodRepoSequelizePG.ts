import type { IFoodRepo } from '../interfaces';
import type { FoodDTN, FoodType, LocString } from '@m-cafe-app/models';
import type { Transaction } from 'sequelize';
import { Food } from '@m-cafe-app/models';
import { Food as FoodPG } from '@m-cafe-app/db';
import { FoodMapper } from '../infrastructure';
import { DatabaseError } from '@m-cafe-app/utils';

export class FoodRepoSequelizePG implements IFoodRepo {

  async getAll(): Promise<Food[]> {
    const dbFoods = await FoodPG.scope('all').findAll();
    return dbFoods.map(food => FoodMapper.dbToDomain(food));
  }

  async getById(id: number): Promise<Food> {
    const dbFood = await FoodPG.scope('allWithTimestamps').findByPk(id);
    if (!dbFood) throw new DatabaseError(`No food type entry with this id ${id}`);
    return FoodMapper.dbToDomain(dbFood);
  }

  async getManySortedByIds(ids: number[]): Promise<Food[]> {
    const dbFoods = await FoodPG.scope('allWithTimestamps').findAll({
      where: { id: ids },
      order: [['id', 'ASC']]
    });
    return dbFoods.map(food => FoodMapper.dbToDomain(food));
  }

  async getByIdWithComponents(id: number): Promise<Food> {
    const dbFood = await FoodPG.scope('allWithComponents').findByPk(id);
    if (!dbFood) throw new DatabaseError(`No food type entry with this id ${id}`);
    return FoodMapper.dbToDomain(dbFood);
  }

  async create(
    foodDTN: FoodDTN,
    nameLoc: LocString,
    descriptionLoc: LocString,
    foodType: FoodType,
    transaction?: Transaction
  ): Promise<Food> {

    const dbFood = await FoodPG.create({
      nameLocId: nameLoc.id,
      descriptionLocId: descriptionLoc.id,
      foodTypeId: foodDTN.foodTypeId,
      price: foodDTN.price
    }, {
      transaction
    });
  
    return new Food(
      dbFood.id,
      nameLoc,
      descriptionLoc,
      foodType,
      dbFood.price
    );

  }

  async update(updFood: Food, transaction?: Transaction): Promise<Food> {

    const [ count, updated ] = await FoodPG.update({
      foodTypeId: updFood.foodType.id,
      price: updFood.price
    }, {
      where: {
        id: updFood.id
      },
      transaction,
      returning: true
    });

    if (count === 0) {
      throw new DatabaseError(`No food type entry with this id ${updFood.id}`);
    }

    // NameLoc and DescriptionLoc are already updated here
    return new Food(
      updated[0].id,
      updFood.nameLoc,
      updFood.descriptionLoc,
      updFood.foodType,
      updated[0].price
    );
  }

  async remove(id: number, transaction?: Transaction): Promise<void> {
    const dbFood = await FoodPG.scope('raw').findByPk(id);
    if (!dbFood) throw new DatabaseError(`No food type entry with this id ${id}`);
    await dbFood.destroy({ transaction });
  }

  async removeAll(): Promise<void> {
    await FoodPG.scope('all').destroy({ force: true, where: {} });
  }
}