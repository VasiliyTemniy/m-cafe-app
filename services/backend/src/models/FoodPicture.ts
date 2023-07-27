import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey } from 'sequelize';
import Food from './Food.js';
import Picture from './Picture.js';

import { sequelize } from '../utils/db.js';

class FoodPicture extends Model<InferAttributes<FoodPicture>, InferCreationAttributes<FoodPicture>> {
  declare id: CreationOptional<number>;
  declare foodId: ForeignKey<Food['id']>;
  declare pictureId: ForeignKey<Picture['id']>;
}

FoodPicture.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
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
}, {
  sequelize,
  underscored: true,
  timestamps: true,
  modelName: 'food_pictures'
});

export default FoodPicture;