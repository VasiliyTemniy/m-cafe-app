import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize'

import { sequelize } from '../utils/db'

class Food extends Model<InferAttributes<Food>, InferCreationAttributes<Food>> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare type: string;
  declare description: string;
  declare price: Number;
}

Food.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false
  },
  price: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
}, {
  sequelize,
  underscored: true,
  timestamps: true,
  modelName: 'food'
})

export default Food