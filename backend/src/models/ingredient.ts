import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey } from 'sequelize';
import LocString from './LocString.js';

import { sequelize } from '../utils/db.js';

class Ingredient extends Model<InferAttributes<Ingredient>, InferCreationAttributes<Ingredient>> {
  declare id: CreationOptional<number>;
  declare nameLocId: ForeignKey<LocString['id']>;
  declare stockMeasureLocId: ForeignKey<LocString['id']>;
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
  nameLocId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'loc_strings', key: 'id' }
  },
  stockMeasureLocId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'loc_strings', key: 'id' }
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