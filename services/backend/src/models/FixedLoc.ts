import { DataTypes } from 'sequelize';

import { sequelize } from '../utils/db.js';
import { FixedLoc } from '@m-cafe-app/db-models';

FixedLoc.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  locStringId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'loc_strings', key: 'id' },
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT'
  }
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'fixed_loc'
});

export default FixedLoc;