import type { MapToDT } from '@m-cafe-app/utils';
import type { FoodPicture } from '../domain';
import type { PictureDT } from './PictureDT.js';
import { isPictureDT } from './PictureDT';
import { isEntity, isNumber } from '@m-cafe-app/utils';


export type FoodPictureDT = Omit<MapToDT<FoodPicture>, 'picture'> & {
  picture: PictureDT;
};

export const isFoodPictureDT = (obj: unknown): obj is FoodPictureDT =>
  isEntity(obj, [{
    properties: ['picture'],
    validator: isPictureDT
  }, {
    properties: ['orderNumber'],
    validator: isNumber
  }]);


export type FoodPictureDTN = {
  foodId: number;
  pictureId: number;
  orderNumber: number;
};

export const isFoodPictureDTN = (obj: unknown): obj is FoodPictureDTN =>
  isEntity(obj, [{
    properties: ['foodId', 'pictureId', 'orderNumber'],
    validator: isNumber
  }]);