import type { FoodDT, FoodDTN } from '@m-cafe-app/models';
import type { IFoodRepo, IFoodService } from '../interfaces';
import type { IFoodTypeRepo } from '../../FoodType';
import type { ILocStringRepo } from '../../LocString';
import type { ITransactionHandler } from '../../../utils';
import { LocStringMapper } from '../../LocString';
import { FoodMapper } from '../infrastructure';


export class FoodService implements IFoodService {
  constructor(
    readonly foodRepo: IFoodRepo,
    readonly foodTypeRepo: IFoodTypeRepo,
    readonly locStringRepo: ILocStringRepo,
    readonly transactionHandler: ITransactionHandler
  ) {}

  async getAll(): Promise<FoodDT[]> {
    const foods = await this.foodRepo.getAll();

    return foods.map(food => FoodMapper.domainToDT(food));
  }

  async getById(id: number): Promise<FoodDT> {
    const food = await this.foodRepo.getById(id);

    return FoodMapper.domainToDT(food);
  }

  async getByIdWithComponents(id: number): Promise<FoodDT> {
    const food = await this.foodRepo.getByIdWithComponents(id);

    return FoodMapper.domainToDT(food);
  }

  async create(foodDTN: FoodDTN): Promise<FoodDT> {
    
    const transaction = await this.transactionHandler.start();

    try {

      const foundFoodType = await this.foodTypeRepo.getById(foodDTN.foodTypeId);

      const createdNameLoc = await this.locStringRepo.create(foodDTN.nameLoc);
      const createdDescriptionLoc = await this.locStringRepo.create(foodDTN.descriptionLoc);

      const createdFood = await this.foodRepo.create(
        foodDTN,
        createdNameLoc,
        createdDescriptionLoc,
        foundFoodType,
        transaction
      );

      await transaction.commit();
      return FoodMapper.domainToDT(createdFood);
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }

  async update(updFood: FoodDT): Promise<FoodDT> {

    const transaction = await this.transactionHandler.start();

    try {
      await this.locStringRepo.update(
        LocStringMapper.dtToDomain(updFood.nameLoc),
        transaction
      );
      await this.locStringRepo.update(
        LocStringMapper.dtToDomain(updFood.descriptionLoc),
        transaction
      );
      
      await this.foodRepo.update(FoodMapper.dtToDomain(updFood));

      await transaction.commit();
      // No need to use any mapper here: if locStrings are updated, transaction is committed, food is already the same as in db
      // If no updFoodType exists, an error will be thrown, transaction will be rolled back
      return updFood;
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }

  async remove(id: number): Promise<void> {
    const foundFood = await this.foodRepo.getById(id);
    await this.foodRepo.remove(id);
    await this.locStringRepo.removeWithCount([foundFood.nameLoc.id, foundFood.descriptionLoc.id]);
  }

  async removeAll(): Promise<void> {
    if (process.env.NODE_ENV !== 'test') return;
    await this.foodRepo.removeAll();
  }

  //TODO: move all food component methods to this service?
}