import type { FoodTypeDT, FoodTypeDTN } from '@m-cafe-app/models';
import type { IFoodTypeRepo, IFoodTypeService } from '../interfaces';
import type { ITransactionHandler } from '../../../utils';
import type { ILocStringRepo } from '../../LocString';
import { LocStringMapper } from '../../LocString';
import { FoodTypeMapper } from '../infrastructure';


export class FoodTypeService implements IFoodTypeService {
  constructor(
    readonly foodTypeRepo: IFoodTypeRepo,
    readonly locStringRepo: ILocStringRepo,
    readonly transactionHandler: ITransactionHandler
  ) {}

  async getAll(withFoodOnly: boolean): Promise<FoodTypeDT[]> {
    const foodTypes = await this.foodTypeRepo.getAll(withFoodOnly);

    return foodTypes.map(foodType => FoodTypeMapper.domainToDT(foodType));
  }

  async getById(id: number): Promise<FoodTypeDT> {
    const foodType = await this.foodTypeRepo.getById(id);

    return FoodTypeMapper.domainToDT(foodType);
  }

  async create(foodTypeDTN: FoodTypeDTN): Promise<FoodTypeDT> {
    const transaction = await this.transactionHandler.start();

    try {

      const createdNameLoc = await this.locStringRepo.create(foodTypeDTN.nameLoc, transaction);
      const createdDescriptionLoc = await this.locStringRepo.create(foodTypeDTN.descriptionLoc, transaction);

      const createdFoodType = await this.foodTypeRepo.create(foodTypeDTN, createdNameLoc, createdDescriptionLoc, transaction);

      await transaction.commit();
      return FoodTypeMapper.domainToDT(createdFoodType);
    } catch(err) {
      await transaction.rollback();
      throw err;
    }
  }

  async update(updFoodType: FoodTypeDT): Promise<FoodTypeDT> {
    const transaction = await this.transactionHandler.start();

    try {

      await this.locStringRepo.update(
        LocStringMapper.dtToDomain(updFoodType.nameLoc),
        transaction
      );
      await this.locStringRepo.update(
        LocStringMapper.dtToDomain(updFoodType.descriptionLoc),
        transaction
      );

      await transaction.commit();
      // No need to use any mapper here: if locStrings are updated, transaction is committed, foodType is already the same as in db
      return updFoodType;
    } catch(err) {
      await transaction.rollback();
      throw err;
    }
  }

  async remove(id: number): Promise<void> {
    const foundFoodType = await this.foodTypeRepo.getById(id);
    await this.foodTypeRepo.remove(id);
    await this.locStringRepo.removeWithCount([foundFoodType.nameLoc.id, foundFoodType.descriptionLoc.id]);
  }

  async removeAll(): Promise<void> {
    if (process.env.NODE_ENV !== 'test') return;
    await this.foodTypeRepo.removeAll();
  }
}