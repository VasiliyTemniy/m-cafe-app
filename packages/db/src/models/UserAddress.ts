import type { InferAttributes, InferCreationAttributes, ForeignKey } from 'sequelize';
import type { Sequelize } from 'sequelize';
import type { User } from './User.js';
import type { Address } from './Address.js';
import { Model, DataTypes } from 'sequelize';


export class UserAddress extends Model<InferAttributes<UserAddress>, InferCreationAttributes<UserAddress>> {
  declare userId: ForeignKey<User['id']>;
  declare addressId: ForeignKey<Address['id']>;
}


export const initUserAddressModel = async (dbInstance: Sequelize) => {
  return new Promise<void>((resolve, reject) => {
    try {
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
        sequelize: dbInstance,
        underscored: true,
        timestamps: false,
        modelName: 'user_address'
      });

      resolve();
    } catch (err) {
      reject(err);
    }
  });
};