import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey } from 'sequelize';
import User from './user.js';
import Address from './address.js';

import { sequelize } from '../utils/db.js';

class Order extends Model<InferAttributes<Order>, InferCreationAttributes<Order>> {
  declare id: CreationOptional<number>;
  declare userId: ForeignKey<User['id']>;
  declare addressId: ForeignKey<Address['id']>;  
  declare deliverAt: Date;
  declare status: string;
}

Order.init({
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
  }
}, {
  sequelize,
  underscored: true,
  timestamps: true,
  modelName: 'order'
});

export default Order;