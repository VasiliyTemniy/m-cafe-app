import { DataTypes } from '@m-cafe-app/shared-backend-deps/sequelize.js';

import { sequelize } from '../utils/db.js';
import { DynamicModule } from '@m-cafe-app/db-models';

DynamicModule.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  moduleType: {
    type: DataTypes.STRING,
    allowNull: false
  },
  locStringId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'loc_strings', key: 'id' },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL'
  },
  page: {
    type: DataTypes.STRING,
    allowNull: false
  },
  placement: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  className: {
    type: DataTypes.STRING,
    allowNull: true
  },
  inlineCss: {
    type: DataTypes.STRING,
    allowNull: true
  },
  pictureId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'pictures', key: 'id' },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL'
  },
  url: {
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
  modelName: 'dynamic_module'
});

export default DynamicModule;