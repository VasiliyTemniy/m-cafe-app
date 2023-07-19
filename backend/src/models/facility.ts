import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey } from 'sequelize';
import Address from './address.js';
import LocString from './locString.js';

import { sequelize } from '../utils/db.js';

class Facility extends Model<InferAttributes<Facility>, InferCreationAttributes<Facility>> {
  declare id: CreationOptional<number>;
  declare addressId: CreationOptional<ForeignKey<Address['id']>>;
  declare nameLocId: ForeignKey<LocString['id']>;
  declare descriptionLocId: ForeignKey<LocString['id']>;
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
    references: { model: 'addresses', key: 'id' },
  },
  nameLocId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'loc_strings', key: 'id' }
  },
  descriptionLocId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'loc_strings', key: 'id' }
  },
}, {
  sequelize,
  underscored: true,
  timestamps: true,
  modelName: 'facility'
});

export default Facility;