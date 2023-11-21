import type { FoodComponentDT, FoodComponentDTN } from '@m-cafe-app/models';
import type { IFoodComponentRepo, IFoodComponentService } from '../interfaces';
import type { IFoodRepo } from '../../Food';
import type { IIngredientRepo } from '../../Ingredient';
import type { ITransactionHandler } from '../../../utils';
import type { Food, Ingredient } from '@m-cafe-app/models';
import { FoodComponentMapper } from '../infrastructure';
import { FoodSimpleMapper } from '../../Food';
import { IngredientSimpleMapper } from '../../Ingredient';


export class FoodComponentService implements IFoodComponentService {
  constructor(
    readonly foodComponentRepo: IFoodComponentRepo,
    readonly foodRepo: IFoodRepo,
    readonly ingredientRepo: IIngredientRepo,
    readonly transactionHandler: ITransactionHandler
  ) {}

  async getAll(): Promise<FoodComponentDT[]> {
    const foodComponents = await this.foodComponentRepo.getAll();

    return foodComponents.map(foodComponent => FoodComponentMapper.domainToDT(foodComponent));
  }

  async getById(id: number): Promise<FoodComponentDT> {
    const foodComponent = await this.foodComponentRepo.getById(id);

    return FoodComponentMapper.domainToDT(foodComponent);
  }

  async create(foodComponentDTN: FoodComponentDTN): Promise<FoodComponentDT> {
    const transaction = await this.transactionHandler.start();

    try {

      const usedComponent = foodComponentDTN.compositeFood
        ? await this.foodRepo.getById(foodComponentDTN.componentId)
        : await this.ingredientRepo.getById(foodComponentDTN.componentId);

      const usedComponentSimple = foodComponentDTN.compositeFood
        ? FoodSimpleMapper.domainToSimple(usedComponent as Food)
        : IngredientSimpleMapper.domainToSimple(usedComponent as Ingredient);

      const createdFoodComponent = await this.foodComponentRepo.create(
        foodComponentDTN,
        usedComponentSimple,
        transaction
      );

      await transaction.commit();
      return FoodComponentMapper.domainToDT(createdFoodComponent);
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }

  async createMany(foodComponentDTNs: FoodComponentDTN[]): Promise<FoodComponentDT[]> {
    const transaction = await this.transactionHandler.start();

    try {
      const createdFoodComponents = await this.foodComponentRepo.createMany(
        foodComponentDTNs,
        transaction
      );

      await transaction.commit();
      return createdFoodComponents.map(foodComponent => FoodComponentMapper.domainToDT(foodComponent));
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }

  async update(foodComponent: FoodComponentDT, foodId: number): Promise<FoodComponentDT> {
    const transaction = await this.transactionHandler.start();

    try {
      const updatedFoodComponent = await this.foodComponentRepo.update(
        FoodComponentMapper.dtToDomain(foodComponent),
        foodId,
        transaction
      );

      await transaction.commit();
      return FoodComponentMapper.domainToDT(updatedFoodComponent); 
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }

  async rewriteAllForOneFood(updFoodComponents: FoodComponentDTN[], foodId: number): Promise<FoodComponentDT[]> {
    const transaction = await this.transactionHandler.start();

    try {
      const rewrittenFoodComponents = await this.foodComponentRepo.rewriteAllForOneFood(
        updFoodComponents,
        foodId,
        transaction
      );

      await transaction.commit();
      return rewrittenFoodComponents.map(foodComponent => FoodComponentMapper.domainToDT(foodComponent));
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }

  async remove(id: number): Promise<void> {
    await this.foodComponentRepo.remove(id);
  }

  async removeMany(ids: number[]): Promise<void> {
    const transaction = await this.transactionHandler.start();

    try {
      await this.foodComponentRepo.removeWithCount(ids, transaction); 
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }

  async removeAll(): Promise<void> {
    if (process.env.NODE_ENV !== 'test') return;
    await this.foodComponentRepo.removeAll();
  }
}