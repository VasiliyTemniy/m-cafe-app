import { DataTypes } from 'sequelize';

import { sequelize } from '../utils/db.js';
import { Facility } from '@m-cafe-app/db-models';

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
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false
  },
}, {
  sequelize,
  underscored: true,
  timestamps: true,
  modelName: 'facility'
});

export default Facility;