import type { InferAttributes, InferCreationAttributes, ForeignKey, NonAttribute } from 'sequelize';
import type { Sequelize } from 'sequelize';
import { Model, DataTypes } from 'sequelize';
import { Food } from './Food.js';
import { Picture } from './Picture.js';


export class FoodPicture extends Model<InferAttributes<FoodPicture>, InferCreationAttributes<FoodPicture>> {
  declare foodId: ForeignKey<Food['id']>;
  declare pictureId: ForeignKey<Picture['id']>;
  declare orderNumber: number;
  declare picture?: NonAttribute<Picture>;
}


export const initFoodPictureModel = async (dbInstance: Sequelize) => {
  return new Promise<void>((resolve, reject) => {
    try {
      FoodPicture.init({
        foodId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: { model: 'foods', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
        pictureId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: { model: 'pictures', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
        orderNumber: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0
        }
      }, {
        sequelize: dbInstance,
        underscored: true,
        timestamps: false,
        modelName: 'food_picture'
      });

      resolve();
    } catch (err) {
      reject(err);
    }
  });
};