import type { InferAttributes, InferCreationAttributes, ForeignKey, Sequelize } from 'sequelize';
import type { User } from './User.js';
import type { Facility } from './Facility.js';
import { Model, DataTypes } from 'sequelize';


export class FacilityManager extends Model<InferAttributes<FacilityManager>, InferCreationAttributes<FacilityManager>> {
  declare userId: ForeignKey<User['id']>;
  declare facilityId: ForeignKey<Facility['id']>;
}


export const initFacilityManagerModel = async (dbInstance: Sequelize) => {
  return new Promise<void>((resolve, reject) => {
    try {
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
        sequelize: dbInstance,
        underscored: true,
        timestamps: false,
        modelName: 'facility_manager'
      });
      
      resolve();
    } catch (err) {
      reject(err);
    }
  });
};