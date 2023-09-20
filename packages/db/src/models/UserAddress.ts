import type { InferAttributes, InferCreationAttributes, ForeignKey } from 'sequelize';
import { Model, DataTypes } from 'sequelize';
import User from './User.js';
import Address from './Address.js';
import { sequelize } from '../db.js';


export class UserAddress extends Model<InferAttributes<UserAddress>, InferCreationAttributes<UserAddress>> {
  declare userId: ForeignKey<User['id']>;
  declare addressId: ForeignKey<Address['id']>;
}


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