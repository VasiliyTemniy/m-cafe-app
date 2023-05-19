import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey } from 'sequelize'
import Food from './food.js'
import Order from './order.js'

import { sequelize } from '../utils/db'

class OrderFood extends Model<InferAttributes<OrderFood>, InferCreationAttributes<OrderFood>> {
  declare id: CreationOptional<number>;
  declare orderId: ForeignKey<Order['id']>;
  declare foodId: ForeignKey<Food['id']>;
  declare amount: Number;
}

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
    allowNull: false,
    references: { model: 'foods', key: 'id' }
  },
  amount: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'order_food'
})

export default OrderFood