import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';

import { sequelize } from '../utils/db.js';

class FoodType extends Model<InferAttributes<FoodType>, InferCreationAttributes<FoodType>> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare description: string;
}

FoodType.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize,
  underscored: true,
  timestamps: true,
  modelName: 'food_type'
});

export default FoodType;