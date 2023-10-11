import type { InferAttributes, InferCreationAttributes, ForeignKey } from 'sequelize';
import type { Sequelize } from 'sequelize';
import { Model, DataTypes } from 'sequelize';
import { User } from './User.js';
import { Facility } from './Facility.js';


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