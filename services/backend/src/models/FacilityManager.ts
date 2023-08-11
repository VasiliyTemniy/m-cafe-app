import { DataTypes } from 'sequelize';

import { sequelize } from '../utils/db.js';
import { FacilityManager } from '@m-cafe-app/db-models';

FacilityManager.init({
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' }
  },
  facilityId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'facilities', key: 'id' }
  }
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'facility_manager'
});

export default FacilityManager;