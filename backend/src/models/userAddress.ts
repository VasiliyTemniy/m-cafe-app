import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey } from 'sequelize';
import User from './user.js';
import Address from './address.js';

import { sequelize } from '../utils/db.js';

class UserAddress extends Model<InferAttributes<UserAddress>, InferCreationAttributes<UserAddress>> {
  declare id: CreationOptional<number>;
  declare userId: CreationOptional<ForeignKey<User['id']>>;
  declare addressId: CreationOptional<ForeignKey<Address['id']>>;
}

UserAddress.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'users', key: 'id' }
  },
  addressId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'addresses', key: 'id' }
  }
}, {
  sequelize,
  underscored: true,
  timestamps: true,
  modelName: 'user_address'
});

export default UserAddress;