import type { IIngredientRepo } from '../interfaces';
import type { IngredientDTN, LocString } from '@m-cafe-app/models';
import type { Transaction } from 'sequelize';
import { Ingredient } from '@m-cafe-app/models';
import { Ingredient as IngredientPG } from '@m-cafe-app/db';
import { IngredientMapper } from '../infrastructure';
import { DatabaseError } from '@m-cafe-app/utils';


export class IngredientRepoSequelizePG implements IIngredientRepo {

  async getAll(): Promise<Ingredient[]> {
    const dbIngredients = await IngredientPG.scope('all').findAll();
    return dbIngredients.map(ingredient => IngredientMapper.dbToDomain(ingredient));
  }

  async getById(id: number): Promise<Ingredient> {
    const dbIngredient = await IngredientPG.scope('allWithTimestamps').findByPk(id);
    if (!dbIngredient) throw new DatabaseError(`No ingredient entry with this id ${id}`);
    return IngredientMapper.dbToDomain(dbIngredient);
  }

  async create(
    ingredientDTN: IngredientDTN,
    nameLoc: LocString,
    stockMeasureLoc: LocString,
    transaction?: Transaction
  ): Promise<Ingredient> {
  
    const dbIngredient = await IngredientPG.create({
      nameLocId: nameLoc.id,
      stockMeasureLocId: stockMeasureLoc.id,
      proteins: ingredientDTN.proteins,
      fats: ingredientDTN.fats,
      carbohydrates: ingredientDTN.carbohydrates,
      calories: ingredientDTN.calories
    }, {
      transaction
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
  }

  async update(updIngredient: Ingredient, transaction?: Transaction): Promise<Ingredient> {

    const [ count, updated ] = await IngredientPG.update({
      proteins: updIngredient.proteins,
      fats: updIngredient.fats,
      carbohydrates: updIngredient.carbohydrates,
      calories: updIngredient.calories
    }, {
      where: { id: updIngredient.id },
      transaction,
      returning: true
    });

    if (count === 0) {
      throw new DatabaseError(`No ingredient entry with this id ${updIngredient.id}`);
    }

    // NameLoc and StockMeasureLoc are already updated here
    return new Ingredient(
      updIngredient.id,
      updIngredient.nameLoc,
      updIngredient.stockMeasureLoc,
      updated[0].proteins,
      updated[0].fats,
      updated[0].carbohydrates,
      updated[0].calories
    );
  }

  async remove(id: number, transaction?: Transaction): Promise<void> {
    const dbIngredient = await IngredientPG.scope('raw').findByPk(id);
    if (!dbIngredient) throw new DatabaseError(`No ingredient type entry with this id ${id}`);
    await dbIngredient.destroy({ transaction });
  }

  async removeAll(): Promise<void> {
    await IngredientPG.scope('all').destroy({ force: true, where: {} });
  }
}