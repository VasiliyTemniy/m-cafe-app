import { DataTypes } from 'sequelize';

import { sequelize } from '../utils/db.js';
import { Picture } from '@m-cafe-app/db-models';

Picture.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  src: {
    type: DataTypes.STRING,
    allowNull: false
  },
  altTextLocId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'loc_strings', key: 'id' },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
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
  modelName: 'picture'
});

export default Picture;