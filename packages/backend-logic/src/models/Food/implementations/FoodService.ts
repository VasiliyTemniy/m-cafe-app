import type { FoodDT, FoodDTN, FoodPictureDTNU, PictureDT, PictureForFoodDTN } from '@m-cafe-app/models';
import type { FoodInclude, IFoodRepo, IFoodService } from '../interfaces';
import type { IFoodTypeRepo } from '../../FoodType';
import type { ILocStringRepo } from '../../LocString';
import type { GenericTransaction, ITransactionHandler } from '../../../utils';
import type { IFoodPictureRepo } from '../../FoodPicture';
import type { IPictureService } from '../../Picture';
import { PictureMapper } from '../../Picture';
import { LocStringMapper } from '../../LocString';
import { FoodMapper } from '../infrastructure';
import { DatabaseError } from '@m-cafe-app/utils';


export class FoodService implements IFoodService {
  constructor(
    readonly foodRepo: IFoodRepo,
    readonly foodTypeRepo: IFoodTypeRepo,
    readonly locStringRepo: ILocStringRepo,
    readonly foodPictureRepo: IFoodPictureRepo,
    readonly pictureService: IPictureService,
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

  async getByIdWithAssociations(
    id: number,
    include: FoodInclude
  ): Promise<FoodDT> {
    const food = await this.foodRepo.getByIdWithAssociations(id, include);

    return FoodMapper.domainToDT(food);
  }

  async getSomeWithAssociations(
    include: FoodInclude,
    limit?: number,
    offset?: number,
    foodTypeId?: number
  ): Promise<FoodDT[]> {
    const foods = await this.foodRepo.getSomeWithAssociations(include, limit, offset, foodTypeId);

    return foods.map(food => FoodMapper.domainToDT(food));
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

    // Add removing of all components! ?
    
    const transaction = await this.transactionHandler.start();

    try {
      const foundFood = await this.foodRepo.getById(id);
      await this.removePicturesByFoodIdInternal(id, transaction);
      await this.foodRepo.remove(id, transaction);
      await this.locStringRepo.removeWithCount([foundFood.nameLoc.id, foundFood.descriptionLoc.id], transaction);
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }

  async removeAll(): Promise<void> {
    if (process.env.NODE_ENV !== 'test') return;
    await this.foodRepo.removeAll();
  }

  async addPicture(pictureDTN: PictureForFoodDTN, tempFilePath: string, originalFileName: string): Promise<PictureDT> {

    const transaction = await this.transactionHandler.start();

    try {

      const foodId = Number(pictureDTN.foodId);
      const orderNumber = Number(pictureDTN.orderNumber);

      const picture = await this.pictureService.create(
        foodId,
        {
          mainStr: pictureDTN.altTextMainStr,
          secStr: pictureDTN.altTextSecStr,
          altStr: pictureDTN.altTextAltStr
        },
        tempFilePath,
        originalFileName,
        'foodPicture',
        transaction
      );

      const foodPictureDTN: FoodPictureDTNU = {
        foodId,
        pictureId: picture.id,
        orderNumber
      };

      const createdFoodPicture = await this.foodPictureRepo.create(foodPictureDTN, picture.id, transaction);

      await transaction.commit();
      return PictureMapper.domainToDT(createdFoodPicture.picture);
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }

  async updatePicturesOrder(foodPicturesDTNU: FoodPictureDTNU[]): Promise<void> {

    const transaction = await this.transactionHandler.start();

    try {

      const foundNewMainPictures = foodPicturesDTNU.filter(foodPicture => foodPicture.orderNumber === 0);

      if (foundNewMainPictures.length === 0) throw new DatabaseError('No new main picture designated. Please, check your request body, make sure to designate a new main picture');
      if (foundNewMainPictures.length > 1) throw new DatabaseError('More than one new main picture designated. Please, check your request body, make sure to designate only one new main picture');
            
      for (const foodPicture of foodPicturesDTNU) {
        await this.foodPictureRepo.update(foodPicture, transaction);
      }

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }

  private async removePictureInternal(pictureDT: PictureDT, foodId: number, transaction: GenericTransaction): Promise<void> {
    await this.foodPictureRepo.remove(foodId, pictureDT.id, transaction);
    await this.pictureService.remove(pictureDT.id, transaction);

    await this.pictureService.deletePictureFile(pictureDT.src);
  }

  async removePicture(pictureDT: PictureDT, foodId: number): Promise<void> {

    const transaction = await this.transactionHandler.start();

    try {
      
      await this.removePictureInternal(pictureDT, foodId, transaction);

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }

  private async removePicturesByFoodIdInternal(foodId: number, transaction: GenericTransaction): Promise<void> {
    const foundFoodPictures = await this.foodPictureRepo.getAllByFoodId(foodId);

    await this.foodPictureRepo.removeByFoodId(foodId, transaction);

    for (const foodPicture of foundFoodPictures) {
      await this.pictureService.remove(foodPicture.picture.id, transaction, true);
    }
  }

  async removePicturesByFoodId(foodId: number): Promise<void> {

    const transaction = await this.transactionHandler.start();

    try {
      
      await this.removePicturesByFoodIdInternal(foodId, transaction);

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }
}