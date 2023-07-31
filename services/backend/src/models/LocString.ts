import { DataTypes } from 'sequelize';

import { sequelize } from '../utils/db.js';
import { LocString } from '@m-cafe-app/db-models';

LocString.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  ruString: {
    type: DataTypes.STRING,
    allowNull: false
  },
  enString: {
    type: DataTypes.STRING,
    allowNull: true
  },
  altString: {
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