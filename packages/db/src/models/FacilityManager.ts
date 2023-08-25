import { Model, InferAttributes, InferCreationAttributes, ForeignKey, DataTypes } from 'sequelize';
import User from './User.js';
import Facility from './Facility.js';
import { sequelize } from '../db.js';


export class FacilityManager extends Model<InferAttributes<FacilityManager>, InferCreationAttributes<FacilityManager>> {
  declare userId: ForeignKey<User['id']>;
  declare facilityId: ForeignKey<Facility['id']>;
}


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