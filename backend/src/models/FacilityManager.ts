import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey } from 'sequelize';
import User from './User.js';
import Facility from './Facility.js';

import { sequelize } from '../utils/db.js';

class FacilityManager extends Model<InferAttributes<FacilityManager>, InferCreationAttributes<FacilityManager>> {
  declare id: CreationOptional<number>;
  declare userId: ForeignKey<User['id']>;
  declare facilityId: ForeignKey<Facility['id']>;
}

FacilityManager.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
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
  timestamps: true,
  modelName: 'facility_manager'
});

export default FacilityManager;