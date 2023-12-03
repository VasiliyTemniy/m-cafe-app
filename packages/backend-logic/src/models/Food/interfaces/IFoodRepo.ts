import type { Food, FoodDTN, FoodType, LocString } from '@m-cafe-app/models';
import type { GenericTransaction, ICRUDRepo } from '../../../utils';


export interface FoodInclude {
  components: boolean;
  mainPicture: boolean;
  gallery: boolean;
}

export interface IFoodRepo extends ICRUDRepo<Food, FoodDTN> {
  getManySortedByIds(ids: number[]): Promise<Food[]>;
  getByIdWithAssociations(
    id: number,
    include: FoodInclude
  ): Promise<Food>;
  getSomeWithAssociations(
    include: FoodInclude,
    limit?: number,
    offset?: number,
    foodTypeId?: number
  ): Promise<Food[]>;
  create(
    foodDTN: FoodDTN,
    nameLoc: LocString,
    descriptionLoc: LocString,
    foodType: FoodType,
    transaction?: GenericTransaction
  ): Promise<Food>;
}