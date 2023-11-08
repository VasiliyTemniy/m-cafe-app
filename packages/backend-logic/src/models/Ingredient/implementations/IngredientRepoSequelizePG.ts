import type { IIngredientRepo } from '../interfaces';
import type { IngredientDTN } from '@m-cafe-app/models';
import type { IDatabaseConnectionHandler } from '@m-cafe-app/db';
import type { Sequelize } from 'sequelize';
import type { ILocStringRepo } from '../../LocString';
import { Ingredient } from '@m-cafe-app/models';
import { Ingredient as IngredientPG } from '@m-cafe-app/db';
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
    const createdIngredient = await this.dbInstance.transaction(async (t) => {
      try {
        const nameLoc = await this.locStringRepo.create(ingredientDTN.nameLoc, t);
        const stockMeasureLoc = await this.locStringRepo.create(ingredientDTN.stockMeasureLoc, t);
  
        const dbIngredient = await IngredientPG.create({
          nameLocId: nameLoc.id,
          stockMeasureLocId: stockMeasureLoc.id,
          proteins: ingredientDTN.proteins,
          fats: ingredientDTN.fats,
          carbohydrates: ingredientDTN.carbohydrates,
          calories: ingredientDTN.calories
        }, {
          transaction: t
        });
  
        // Not using mapper here because of inability to include returning locs
        // Only other way is to use afterCreate hook for Sequelize
        return new Ingredient(
          dbIngredient.id,
          nameLoc,
          stockMeasureLoc,
          dbIngredient.proteins,
          dbIngredient.fats,
          dbIngredient.carbohydrates,
          dbIngredient.calories
        );
      } catch (err) {
        await t.rollback();
        throw err;
      }
    });

    return createdIngredient;
  }

  async update(updIngredient: Ingredient): Promise<Ingredient> {
    const updatedIngredient = await this.dbInstance.transaction(async (t) => {
      try {
        const updatedNameLoc = await this.locStringRepo.update(updIngredient.nameLoc);
        const updatedStockMeasureLoc = await this.locStringRepo.update(updIngredient.stockMeasureLoc);

        const [ count, updated ] = await IngredientPG.update({
          proteins: updIngredient.proteins,
          fats: updIngredient.fats,
          carbohydrates: updIngredient.carbohydrates,
          calories: updIngredient.calories
        }, {
          where: { id: updIngredient.id },
          transaction: t,
          returning: true
        });

        if (count === 0) {
          await t.rollback();
          throw new DatabaseError(`No ingredient entry with this id ${updIngredient.id}`);
        }

        return new Ingredient(
          updIngredient.id,
          updatedNameLoc,
          updatedStockMeasureLoc,
          updated[0].proteins,
          updated[0].fats,
          updated[0].carbohydrates,
          updated[0].calories
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

    // Remove loc strings. If needed, add logging of deleted count
    await this.locStringRepo.removeWithCount(dbIngredient.nameLocId);
    await this.locStringRepo.removeWithCount(dbIngredient.stockMeasureLocId);

    await dbIngredient.destroy();
  }

  async removeAll(): Promise<void> {
    await IngredientPG.scope('all').destroy({ force: true, where: {} });
  }
}