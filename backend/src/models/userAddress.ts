import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey } from 'sequelize';
import User from './user.js';
import Address from './address.js';

import { sequelize } from '../utils/db.js';

class UserAddress extends Model<InferAttributes<UserAddress>, InferCreationAttributes<UserAddress>> {
  declare id: CreationOptional<number>;
  declare userId: ForeignKey<User['id']>;
  declare addressId: ForeignKey<Address['id']>;
}

UserAddress.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
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
  timestamps: true,
  modelName: 'user_address'
});

export default UserAddress;