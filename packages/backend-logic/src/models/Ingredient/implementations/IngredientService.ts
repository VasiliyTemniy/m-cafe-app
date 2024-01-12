import type { IngredientDT, IngredientDTN } from '@m-market-app/models';
import type { IIngredientRepo, IIngredientService } from '../interfaces';
import type { ILocStringRepo } from '../../LocString';
import type { ITransactionHandler } from '../../../utils';
import { LocStringMapper } from '../../LocString';
import { IngredientMapper } from '../infrastructure';


export class IngredientService implements IIngredientService {
  constructor(
    readonly ingredientRepo: IIngredientRepo,
    readonly locStringRepo: ILocStringRepo,
    readonly transactionHandler: ITransactionHandler
  ) {}
  async getAll(): Promise<IngredientDT[]> {
    const ingredients = await this.ingredientRepo.getAll();

    return ingredients.map(ingredient => IngredientMapper.domainToDT(ingredient));
  }

  async getById(id: number): Promise<IngredientDT> {
    const ingredient = await this.ingredientRepo.getById(id);

    return IngredientMapper.domainToDT(ingredient);
  }

  async create(ingredientDTN: IngredientDTN): Promise<IngredientDT> {

    const transaction = await this.transactionHandler.start();

    try {

      const createdNameLoc = await this.locStringRepo.create(ingredientDTN.nameLoc, transaction);
      const createdStockMeasureLoc = await this.locStringRepo.create(ingredientDTN.stockMeasureLoc, transaction);

      const createdIngredient = await this.ingredientRepo.create(
        ingredientDTN,
        createdNameLoc,
        createdStockMeasureLoc,
        transaction
      );
  
      await transaction.commit();
      return IngredientMapper.domainToDT(createdIngredient);
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }

  async update(updIngredient: IngredientDT): Promise<IngredientDT> {

    const transaction = await this.transactionHandler.start();

    try {

      await this.locStringRepo.update(
        LocStringMapper.dtToDomain(updIngredient.nameLoc),
        transaction
      );
      await this.locStringRepo.update(
        LocStringMapper.dtToDomain(updIngredient.stockMeasureLoc),
        transaction
      );

      await this.ingredientRepo.update(IngredientMapper.dtToDomain(updIngredient));

      await transaction.commit();
      // No need to use any mapper here: if locStrings are updated, transaction is committed, ingredient is already the same as in db
      return updIngredient;
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }

  async remove(id: number): Promise<void> {
    const foundIngredient = await this.ingredientRepo.getById(id);
    await this.ingredientRepo.remove(id);
    await this.locStringRepo.removeWithCount([foundIngredient.nameLoc.id, foundIngredient.stockMeasureLoc.id]);
  }

  async removeAll(): Promise<void> {
    if (process.env.NODE_ENV !== 'test') return;
    await this.ingredientRepo.removeAll();
  }
}