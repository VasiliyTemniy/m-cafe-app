import { DataTypes } from 'sequelize';

import { sequelize } from '../utils/db.js';
import { Stock } from '@m-cafe-app/db-models';

Stock.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  ingredientId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'ingredients', key: 'id' },
    unique: 'unique_stock'
  },
  facilityId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'facilities', key: 'id' },
    unique: 'unique_stock'
  },
  amount: {
    type: DataTypes.INTEGER,
    allowNull: false
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
  modelName: 'stock',
  indexes: [
    {
      unique: true,
      fields: ['ingredient_id', 'facility_id']
    }
  ]
});

export default Stock;