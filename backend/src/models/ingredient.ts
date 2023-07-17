import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';

import { sequelize } from '../utils/db.js';

class Ingredient extends Model<InferAttributes<Ingredient>, InferCreationAttributes<Ingredient>> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare stockMeasure: string;
  declare proteins: CreationOptional<number>;
  declare fats: CreationOptional<number>;
  declare carbohydrates: CreationOptional<number>;
  declare calories: CreationOptional<number>;
}

Ingredient.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  stockMeasure: {
    type: DataTypes.STRING,
    allowNull: false
  },
  proteins: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  fats: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  carbohydrates: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  calories: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  sequelize,
  underscored: true,
  timestamps: true,
  modelName: 'ingredient'
});

export default Ingredient;