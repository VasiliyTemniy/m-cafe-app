import type { FoodPicture as FoodPicturePG } from '@m-cafe-app/db';
import type { FoodPictureDT } from '@m-cafe-app/models';
import type { EntityDBMapper, EntityDTMapper } from '../../../utils';
import { FoodPicture } from '@m-cafe-app/models';
import { ApplicationError } from '@m-cafe-app/utils';
import { PictureMapper } from '../../Picture';

export class FoodPictureMapper implements EntityDBMapper<FoodPicture, FoodPicturePG>, EntityDTMapper<FoodPicture, FoodPictureDT> {
  public static dbToDomain(dbFoodPicture: FoodPicturePG): FoodPicture {
    if (!dbFoodPicture.picture)
      throw new ApplicationError('FoodPicture data corrupt: picture is missing check for wrong db include clause');

    const domainFoodPicture = new FoodPicture(
      PictureMapper.dbToDomain(dbFoodPicture.picture),
      dbFoodPicture.orderNumber
    );

    return domainFoodPicture;
  }

  dbToDomain(dbFoodPicture: FoodPicturePG): FoodPicture {
    return FoodPictureMapper.dbToDomain(dbFoodPicture);
  }

  public static dtToDomain(foodFoodPictureDT: FoodPictureDT): FoodPicture {
    const domainFoodPicture = new FoodPicture(
      PictureMapper.dtToDomain(foodFoodPictureDT.picture),
      foodFoodPictureDT.orderNumber
    );
    return domainFoodPicture;
  }

  dtToDomain(foodFoodPictureDT: FoodPictureDT): FoodPicture {
    return FoodPictureMapper.dtToDomain(foodFoodPictureDT);
  }

  public static domainToDT(domainFoodPicture: FoodPicture): FoodPictureDT {
    const foodPictureDT: FoodPictureDT = {
      picture: PictureMapper.domainToDT(domainFoodPicture.picture),
      orderNumber: domainFoodPicture.orderNumber
    };
    return foodPictureDT;
  }

  domainToDT(domainFoodPicture: FoodPicture): FoodPictureDT {
    return FoodPictureMapper.domainToDT(domainFoodPicture);
  }
}