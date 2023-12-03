import type { IFoodComponentRepo } from '../interfaces';
import type { FoodComponentDTN, FoodS, IngredientS } from '@m-cafe-app/models';
import type { Transaction } from 'sequelize';
import { FoodComponent } from '@m-cafe-app/models';
import { FoodComponent as FoodComponentPG } from '@m-cafe-app/db';
import { FoodComponentMapper } from '../infrastructure';
import { DatabaseError } from '@m-cafe-app/utils';


export class FoodComponentRepoSequelizePG implements IFoodComponentRepo {

  async getAll(): Promise<FoodComponent[]> {
    const dbFoodComponents = await FoodComponentPG.scope('all').findAll();
    return dbFoodComponents.map(foodComponent => FoodComponentMapper.dbToDomain(foodComponent));
  }

  async getById(id: number): Promise<FoodComponent> {
    const dbFoodComponent = await FoodComponentPG.scope('allWithTimestamps').findByPk(id);
    if (!dbFoodComponent) throw new DatabaseError(`No foodComponent entry with this id ${id}`);
    return FoodComponentMapper.dbToDomain(dbFoodComponent);
  }

  async create(
    foodComponentDTN: FoodComponentDTN,
    usedComponentSimple: FoodS | IngredientS,
    transaction?: Transaction
  ): Promise<FoodComponent> {

    const dbFoodComponent = await FoodComponentPG.create({
      foodId: foodComponentDTN.foodId,
      componentId: foodComponentDTN.componentId,
      quantity: foodComponentDTN.quantity,
      compositeFood: foodComponentDTN.compositeFood,
    }, {
      transaction
    });

    return new FoodComponent(
      dbFoodComponent.id,
      usedComponentSimple,
      dbFoodComponent.quantity,
      dbFoodComponent.compositeFood,
    );
  }

  async createMany(foodComponentDTNs: FoodComponentDTN[], transaction: Transaction): Promise<FoodComponent[]> {
    return this.createManyInternal(foodComponentDTNs, transaction);
  }

  private async createManyInternal(foodComponentDTNs: FoodComponentDTN[], transaction: Transaction): Promise<FoodComponent[]> {
    const createdFoodComponents = await FoodComponentPG.bulkCreate(foodComponentDTNs, {
      transaction
    });

    if (createdFoodComponents.length !== foodComponentDTNs.length) {
      throw new DatabaseError(`Not all foodComponents were created. Check database logs.`);
    }

    return createdFoodComponents.map(foodComponent => FoodComponentMapper.dbToDomain(foodComponent));
  }

  async update(updFoodComponent: FoodComponent, foodId: number, transaction?: Transaction): Promise<FoodComponent> {

    const [ count, updated ] = await FoodComponentPG.update({
      foodId,
      componentId: updFoodComponent.component.id,
      quantity: updFoodComponent.quantity,
      compositeFood: updFoodComponent.compositeFood,
    }, {
      where: { id: updFoodComponent.id },
      transaction,
      returning: true
    });

    if (count === 0) {
      throw new DatabaseError(`No foodComponent entry with this id ${updFoodComponent.id}`);
    }

    return FoodComponentMapper.dbToDomain(updated[0]);

  }

  async rewriteAllForOneFood(
    updFoodComponents: FoodComponentDTN[],
    foodId: number,
    transaction: Transaction
  ): Promise<FoodComponent[]> {

    const deletedCount = await FoodComponentPG.destroy({
      where: { foodId },
      transaction,
    });

    const rewrittenFoodComponents = await this.createManyInternal(updFoodComponents, transaction);

    if (deletedCount !== rewrittenFoodComponents.length) {
      throw new DatabaseError(`Not all foodComponents were created. Check database logs.`);
    }

    return rewrittenFoodComponents;
  }

  async remove(id: number, transaction?: Transaction): Promise<void> {
    const dbFoodComponent = await FoodComponentPG.scope('raw').findByPk(id);
    if (!dbFoodComponent) throw new DatabaseError(`No foodComponent entry with this id ${id}`);

    await dbFoodComponent.destroy({ transaction });
  }

  async removeWithCount(ids: number[], transaction?: Transaction): Promise<number> {
    return await FoodComponentPG.scope('raw').destroy({ where: { id: ids }, transaction });
  }

  async removeAll(): Promise<void> {
    await FoodComponentPG.scope('all').destroy({ force: true, where: {} });
  }
}