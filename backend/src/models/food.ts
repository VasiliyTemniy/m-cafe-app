import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey } from 'sequelize';
import FoodType from './foodType.js';

import { sequelize } from '../utils/db.js';

class Food extends Model<InferAttributes<Food>, InferCreationAttributes<Food>> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare foodTypeId: ForeignKey<FoodType['id']>;
  declare description: string;
  declare price: number;
}

Food.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  foodTypeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'food_types', key: 'id' }
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false
  },
  price: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
}, {
  sequelize,
  underscored: true,
  timestamps: true,
  modelName: 'food'
});

export default Food;