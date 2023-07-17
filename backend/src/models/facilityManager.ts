import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey } from 'sequelize';
import User from './user.js';
import Facility from './facility.js';

import { sequelize } from '../utils/db.js';

class FacilityManager extends Model<InferAttributes<FacilityManager>, InferCreationAttributes<FacilityManager>> {
  declare id: CreationOptional<number>;
  declare userId: CreationOptional<ForeignKey<User['id']>>;
  declare facilityId: CreationOptional<ForeignKey<Facility['id']>>;
}

FacilityManager.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'users', key: 'id' }
  },
  facilityId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'facilities', key: 'id' }
  }
}, {
  sequelize,
  underscored: true,
  timestamps: true,
  modelName: 'facility_manager'
});

export default FacilityManager;