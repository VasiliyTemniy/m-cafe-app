import { DataTypes } from 'sequelize';

import { sequelize } from '../utils/db.js';
import { UserAddress } from '@m-cafe-app/db-models';

UserAddress.init({
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' }
  },
  addressId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'addresses', key: 'id' }
  }
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'user_address'
});

export default UserAddress;