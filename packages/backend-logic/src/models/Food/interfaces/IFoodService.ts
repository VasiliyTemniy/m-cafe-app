import type { FoodDT, FoodDTN, FoodPictureDTNU, PictureDT, PictureForFoodDTN } from '@m-market-app/models';
import type { ICRUDService } from '../../../utils';
import type { FoodInclude } from './IFoodRepo';

export interface IFoodService extends ICRUDService<FoodDT, FoodDTN> {
  getByIdWithAssociations(
    id: number,
    include: FoodInclude
  ): Promise<FoodDT>;
  getSomeWithAssociations(
    include: FoodInclude,
    limit?: number,
    offset?: number,
    foodTypeId?: number,
  ): Promise<FoodDT[]>;
  addPicture(
    pictureDTN: PictureForFoodDTN,
    tempFilePath: string,
    originalFileName: string
  ): Promise<PictureDT>;
  updatePicturesOrder(foodPicturesDTNU: FoodPictureDTNU[]): Promise<void>;
  removePicture(pictureDT: PictureDT, foodId: number): Promise<void>;
  removePicturesByFoodId(foodId: number): Promise<void>;
}