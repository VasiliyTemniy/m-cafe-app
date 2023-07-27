import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey } from 'sequelize';
import Food from './Food.js';
import Image from './Image.js';

import { sequelize } from '../utils/db.js';

class FoodImage extends Model<InferAttributes<FoodImage>, InferCreationAttributes<FoodImage>> {
  declare id: CreationOptional<number>;
  declare foodId: ForeignKey<Food['id']>;
  declare imageId: ForeignKey<Image['id']>;
}

FoodImage.init({
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
  imageId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'images', key: 'id' },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
}, {
  sequelize,
  underscored: true,
  timestamps: true,
  modelName: 'food_image'
});

export default FoodImage;