import type { FoodPicture, FoodPictureDTNU } from '@m-market-app/models';
import type { GenericTransaction, ICRUDRepo } from '../../../utils';

export interface IFoodPictureRepo extends Omit<ICRUDRepo<FoodPicture, FoodPictureDTNU>, 'getAll' | 'getById' | 'update'> {
  getAllByFoodId(foodId: number): Promise<FoodPicture[]>;
  getMainPictureByFoodId(foodId: number): Promise<FoodPicture>;
  update(foodPictureDTNU: FoodPictureDTNU, transaction?: GenericTransaction): Promise<FoodPicture>;
  removeByFoodId(foodId: number, transaction?: GenericTransaction): Promise<number>;
}