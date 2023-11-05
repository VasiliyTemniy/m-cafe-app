import type { IIngredientRepo } from '../interfaces';
import type { IngredientDTN } from '@m-cafe-app/models';
import type { IDatabaseConnectionHandler } from '@m-cafe-app/db';
import type { Sequelize } from 'sequelize';
import type { ILocStringRepo } from '../../LocString';
import { Ingredient } from '@m-cafe-app/models';
import { Ingredient as IngredientPG, LocString as LocStringPG } from '@m-cafe-app/db';
import { IngredientMapper } from '../infrastructure';
import { DatabaseError } from '@m-cafe-app/utils';


export class IngredientRepoSequelizePG implements IIngredientRepo {

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

  async getAll(): Promise<Ingredient[]> {
    const dbIngredients = await IngredientPG.scope('all').findAll();
    return dbIngredients.map(ingredient => IngredientMapper.dbToDomain(ingredient));
  }

  async getById(id: number): Promise<Ingredient> {
    const dbIngredient = await IngredientPG.scope('allWithTimestamps').findByPk(id);
    if (!dbIngredient) throw new DatabaseError(`No ingredient type entry with this id ${id}`);
    return IngredientMapper.dbToDomain(dbIngredient);
  }

  async create(ingredientDTN: IngredientDTN): Promise<Ingredient> {

    const dbNameLoc = await this.locStringRepo.create(ingredientDTN.nameLoc);
    const dbStockMeasureLoc = await this.locStringRepo.create(ingredientDTN.stockMeasureLoc);

    const dbIngredient = await IngredientPG.create({
      nameLocId: dbNameLoc.id,
      stockMeasureLocId: dbStockMeasureLoc.id,
      proteins: ingredientDTN.proteins,
      fats: ingredientDTN.fats,
      carbohydrates: ingredientDTN.carbohydrates,
      calories: ingredientDTN.calories
    });

    // Not using mapper here because of inability to include returning locs
    // Only other way is to use afterCreate hook for Sequelize
    return new Ingredient(
      dbIngredient.id,
      dbNameLoc,
      dbStockMeasureLoc,
      dbIngredient.proteins,
      dbIngredient.fats,
      dbIngredient.carbohydrates,
      dbIngredient.calories
    );
  }

  async update(updIngredient: Ingredient): Promise<Ingredient> {
    const updatedIngredient = await this.dbInstance.transaction(async (t) => {

      // const dbIngredient = await IngredientPG.scope('raw').findByPk(updIngredient.id);
      // if (!dbIngredient) {
      //   await t.rollback();
      //   throw new DatabaseError(`No ingredient type entry with this id ${updIngredient.id}`);
      // }

      // const dbNameLoc = await LocStringPG.scope('all').findByPk(updIngredient.nameLoc.id);
      // if (!dbNameLoc) {
      //   await t.rollback();
      //   throw new DatabaseError(`No name loc entry with this id ${updIngredient.nameLoc.id}`);
      // }

      // const dbStockMeasureLoc = await LocStringPG.scope('all').findByPk(updIngredient.stockMeasureLoc.id);
      // if (!dbStockMeasureLoc) {
      //   await t.rollback();
      //   throw new DatabaseError(`No stock measure loc entry with this id ${updIngredient.stockMeasureLoc.id}`);
      // }
    
      try {
        const updatedNameLoc = await this.locStringRepo.update(updIngredient.nameLoc);
        const updatedStockMeasureLoc = await this.locStringRepo.update(updIngredient.stockMeasureLoc);

        return new Ingredient(
          updIngredient.id,
          updatedNameLoc,
          updatedStockMeasureLoc,
          updIngredient.proteins,
          updIngredient.fats,
          updIngredient.carbohydrates,
          updIngredient.calories
        );
      } catch (err) {
        await t.rollback();
        throw err;
      }
    });

    return updatedIngredient;
  }

  async remove(id: number): Promise<void> {
    const dbIngredient = await IngredientPG.scope('raw').findByPk(id);
    if (!dbIngredient) throw new DatabaseError(`No ingredient type entry with this id ${id}`);

    await LocStringPG.scope('all').destroy({ where: { id: dbIngredient.nameLocId } });
    await LocStringPG.scope('all').destroy({ where: { id: dbIngredient.stockMeasureLocId } });

    await dbIngredient.destroy();
  }

  async removeAll(): Promise<void> {
    await IngredientPG.scope('all').destroy({ force: true, where: {} });
  }
}