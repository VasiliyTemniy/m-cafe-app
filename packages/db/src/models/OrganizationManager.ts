import type { InferAttributes, InferCreationAttributes, ForeignKey, Sequelize } from 'sequelize';
import type { User } from './User.js';
import type { Organization } from './Organization.js';
import { Model, DataTypes } from 'sequelize';


export class OrganizationManager extends
  Model<InferAttributes<OrganizationManager>, InferCreationAttributes<OrganizationManager>> {
  declare userId: ForeignKey<User['id']>;
  declare organizationId: ForeignKey<Organization['id']>;
}


export const initOrganizationManagerModel = async (dbInstance: Sequelize) => {
  return new Promise<void>((resolve, reject) => {
    try {
      OrganizationManager.init({
        userId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: { model: 'users', key: 'id' }
        },
        organizationId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: { model: 'organizations', key: 'id' }
        }
      }, {
        sequelize: dbInstance,
        underscored: true,
        timestamps: false,
        modelName: 'organization_manager'
      });
      
      resolve();
    } catch (err) {
      reject(err);
    }
  });
};