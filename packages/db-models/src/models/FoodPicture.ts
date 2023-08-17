import { Model, InferAttributes, InferCreationAttributes, ForeignKey, NonAttribute } from 'sequelize';
import { Food } from './Food.js';
import { Picture } from './Picture.js';

export class FoodPicture extends Model<InferAttributes<FoodPicture>, InferCreationAttributes<FoodPicture>> {
  declare foodId: ForeignKey<Food['id']>;
  declare pictureId: ForeignKey<Picture['id']>;
  declare mainPicture: boolean;
  declare picture?: NonAttribute<Picture>;
}