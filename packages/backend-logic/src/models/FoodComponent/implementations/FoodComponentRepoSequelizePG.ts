import type { IFoodComponentRepo } from '../interfaces';
import type { FoodComponentDTN } from '@m-cafe-app/models';
import type { IDatabaseConnectionHandler } from '@m-cafe-app/db';
import type { Sequelize } from 'sequelize';
import { FoodComponent } from '@m-cafe-app/models';
import { FoodComponent as FoodComponentPG, Food as FoodPG, Ingredient as IngredientPG } from '@m-cafe-app/db';
import { FoodComponentMapper } from '../infrastructure';
import { DatabaseError } from '@m-cafe-app/utils';
import { FoodMapper } from '../../Food/infrastructure';
import { IngredientMapper } from '../../Ingredient';


export class FoodComponentRepoSequelizePG implements IFoodComponentRepo {

  private dbInstance: Sequelize;

  constructor(
    readonly dbHandler: IDatabaseConnectionHandler,
  ) {
    if (!dbHandler.dbInstance) {
      throw new DatabaseError('No database connection');
    }
    this.dbInstance = dbHandler.dbInstance;
  }

  async getAll(): Promise<FoodComponent[]> {
    const dbFoodComponents = await FoodComponentPG.scope('all').findAll();
    return dbFoodComponents.map(foodComponent => FoodComponentMapper.dbToDomain(foodComponent));
  }

  async getById(id: number): Promise<FoodComponent> {
    const dbFoodComponent = await FoodComponentPG.scope('allWithTimestamps').findByPk(id);
    if (!dbFoodComponent) throw new DatabaseError(`No foodComponent type entry with this id ${id}`);
    return FoodComponentMapper.dbToDomain(dbFoodComponent);
  }

  async create(foodComponentDTN: FoodComponentDTN): Promise<FoodComponent> {
    const createdFoodComponent = await this.dbInstance.transaction(async (t) => {
      try {
        const dbFoodComponent = await FoodComponentPG.create({
          foodId: foodComponentDTN.foodId,
          componentId: foodComponentDTN.componentId,
          amount: foodComponentDTN.amount,
          compositeFood: foodComponentDTN.compositeFood,
        }, {
          transaction: t
        });
      
        const dbUsedComponent = dbFoodComponent.compositeFood
          ? await FoodPG.scope('all').findByPk(dbFoodComponent.componentId)
          : await IngredientPG.scope('all').findByPk(dbFoodComponent.componentId);
        if (!dbUsedComponent) throw new DatabaseError(`No component entry with this id ${dbFoodComponent.componentId}`);
      
        const usedComponent = dbFoodComponent.compositeFood
          ? FoodMapper.dbToDomain(dbUsedComponent as FoodPG)
          : IngredientMapper.dbToDomain(dbUsedComponent as IngredientPG);

        // Not using mapper here because of inability to include returning component
        // Only other way is to use afterCreate hook for Sequelize
        return new FoodComponent(
          dbFoodComponent.id,
          usedComponent,
          dbFoodComponent.amount,
          dbFoodComponent.compositeFood,
        );

      } catch (err) {
        await t.rollback();
        throw err;
      }
    });

    return createdFoodComponent;
  }

  async createMany(foodComponentDTNs: FoodComponentDTN[]): Promise<FoodComponent[]> {
    const dbFoodComponents = await this.dbInstance.transaction(async (t) => {
      try {
        const createdFoodComponents = await FoodComponentPG.bulkCreate(foodComponentDTNs, {
          transaction: t
        });

        if (createdFoodComponents.length !== foodComponentDTNs.length) {
          await t.rollback();
          throw new DatabaseError(`Not all foodComponents were created. Check database logs.`);
        }

        return createdFoodComponents;

      } catch (err) {
        await t.rollback();
        throw err;
      }
    });

    return dbFoodComponents.map(foodComponent => FoodComponentMapper.dbToDomain(foodComponent));
  }

  async update(updFoodComponent: FoodComponent, foodId: number): Promise<FoodComponent> {
    const updatedFoodComponent = await this.dbInstance.transaction(async (t) => {

      const [ count, updated ] = await FoodComponentPG.update({
        foodId,
        componentId: updFoodComponent.component.id,
        amount: updFoodComponent.amount,
        compositeFood: updFoodComponent.compositeFood,
      }, {
        where: { id: updFoodComponent.id },
        transaction: t,
        returning: true
      });

      if (count === 0) {
        await t.rollback();
        throw new DatabaseError(`No foodComponent entry with this id ${updFoodComponent.id}`);
      }

      return FoodComponentMapper.dbToDomain(updated[0]);
    });

    return updatedFoodComponent;
  }

  async rewriteAllForOneFood(updFoodComponents: FoodComponentDTN[], foodId: number): Promise<FoodComponent[]> {
    const rewrittenFoodComponents = await this.dbInstance.transaction(async (t) => {
      
      try {
        const deletedCount = await FoodComponentPG.destroy({
          where: { foodId },
          transaction: t,
        });

        const createdFoodComponents = await this.createMany(updFoodComponents);

        if (deletedCount !== createdFoodComponents.length) {
          await t.rollback();
          throw new DatabaseError(`Not all foodComponents were created. Check database logs.`);
        }

        return createdFoodComponents;
        
      } catch (err) {
        await t.rollback();
        throw err;
      }

    });

    return rewrittenFoodComponents;
  }

  async remove(id: number): Promise<void> {
    const dbFoodComponent = await FoodComponentPG.scope('raw').findByPk(id);
    if (!dbFoodComponent) throw new DatabaseError(`No foodComponent entry with this id ${id}`);

    await dbFoodComponent.destroy();
  }

  async removeAll(): Promise<void> {
    await FoodComponentPG.scope('all').destroy({ force: true, where: {} });
  }
}