import { DataTypes } from '@m-cafe-app/shared-backend-deps/sequelize.js';

import { sequelize } from '../utils/db.js';
import { Session } from '@m-cafe-app/db-models';

Session.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' },
  },
  token: {
    type: DataTypes.STRING,
    allowNull: false
  },
  userAgent: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'unknown'
  }
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'session'
});

export default Session;