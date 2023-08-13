import { DataTypes } from 'sequelize';

import { sequelize } from '../utils/db.js';
import { OrderFood } from '@m-cafe-app/db-models';

OrderFood.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  orderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'orders', key: 'id' }
  },
  foodId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'foods', key: 'id' },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL'
  },
  amount: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  archivePrice: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  archiveFoodName: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'order_food'
});

export default OrderFood;