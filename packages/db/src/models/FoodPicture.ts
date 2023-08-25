import { Model, InferAttributes, InferCreationAttributes, ForeignKey, NonAttribute, DataTypes } from 'sequelize';
import Food from './Food.js';
import Picture from './Picture.js';
import { sequelize } from '../db.js';


export class FoodPicture extends Model<InferAttributes<FoodPicture>, InferCreationAttributes<FoodPicture>> {
  declare foodId: ForeignKey<Food['id']>;
  declare pictureId: ForeignKey<Picture['id']>;
  declare orderNumber: number;
  declare picture?: NonAttribute<Picture>;
}


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
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'food_picture'
});

export default FoodPicture;