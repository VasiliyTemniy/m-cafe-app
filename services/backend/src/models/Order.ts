import { DataTypes } from '@m-cafe-app/shared-backend-deps/sequelize.js';

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
    allowNull: false,
    references: { model: 'users', key: 'id' },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  addressId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'addresses', key: 'id' },
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