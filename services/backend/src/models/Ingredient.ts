import { DataTypes } from 'sequelize';

import { sequelize } from '../utils/db.js';
import { Ingredient } from '@m-cafe-app/db-models';

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
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false
  },
}, {
  sequelize,
  underscored: true,
  timestamps: true,
  modelName: 'ingredient'
});

export default Ingredient;