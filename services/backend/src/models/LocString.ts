import { DataTypes } from 'sequelize';

import { sequelize } from '../utils/db.js';
import { LocString } from '@m-cafe-app/db-models';

LocString.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  mainStr: {
    type: DataTypes.STRING,
    allowNull: false
  },
  secStr: {
    type: DataTypes.STRING,
    allowNull: true
  },
  altStr: {
    type: DataTypes.STRING,
    allowNull: true
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
  modelName: 'loc_string'
});

export default LocString;