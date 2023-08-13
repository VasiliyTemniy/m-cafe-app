import { DataTypes } from 'sequelize';

import { sequelize } from '../utils/db.js';
import { Order } from '@m-cafe-app/db-models';

Order.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'users', key: 'id' },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL'
  },
  addressId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'addresses', key: 'id' },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL'
  },
  facilityId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'facilities', key: 'id' },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  deliverAt: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      isDate: true
    }
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false
  },
  totalCost: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  archiveAddress: {
    type: DataTypes.STRING,
    allowNull: false
  },
  customerName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  customerPhonenumber: {
    type: DataTypes.STRING,
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
  modelName: 'order'
});

export default Order;