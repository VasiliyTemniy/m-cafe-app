import type { InferAttributes, InferCreationAttributes, ForeignKey } from 'sequelize';
import type { Sequelize } from 'sequelize';
import type { Role } from './Role.js';
import type { Permission } from './Permission.js';
import { Model, DataTypes } from 'sequelize';


export class RolePermission extends Model<InferAttributes<RolePermission>, InferCreationAttributes<RolePermission>> {
  declare roleId: ForeignKey<Role['id']>;
  declare permissionId: ForeignKey<Permission['id']>;
}


export const initRolePermissionModel = async (dbInstance: Sequelize) => {
  return new Promise<void>((resolve, reject) => {
    try {
      RolePermission.init({
        roleId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: { model: 'roles', key: 'id' }
        },
        permissionId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: { model: 'permissiones', key: 'id' }
        }
      }, {
        sequelize: dbInstance,
        underscored: true,
        timestamps: false,
        modelName: 'role_permission'
      });

      resolve();
    } catch (err) {
      reject(err);
    }
  });
};