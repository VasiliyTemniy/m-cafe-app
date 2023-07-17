import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey } from 'sequelize';
import Address from './address.js';

import { sequelize } from '../utils/db.js';

class Facility extends Model<InferAttributes<Facility>, InferCreationAttributes<Facility>> {
  declare id: CreationOptional<number>;
  declare addressId: CreationOptional<ForeignKey<Address['id']>>;
  declare name: string;
  declare description: CreationOptional<string>;
}

Facility.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  addressId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'addresses', key: 'id' }
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  sequelize,
  underscored: true,
  timestamps: true,
  modelName: 'facility'
});

export default Facility;