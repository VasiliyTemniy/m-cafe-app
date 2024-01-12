import type { InferAttributes, InferCreationAttributes, ForeignKey, NonAttribute } from 'sequelize';
import type { Sequelize } from 'sequelize';
import type { Role } from './Role.js';
import type { Permission } from './Permission.js';
import { Model, DataTypes } from 'sequelize';
import { User } from './User.js';


export class RolePermission extends Model<InferAttributes<RolePermission>, InferCreationAttributes<RolePermission>> {
  declare roleId: ForeignKey<Role['id']>;
  declare permissionId: ForeignKey<Permission['id']>;
  declare createdBy: ForeignKey<User['id']>;
  declare createdByAuthor?: NonAttribute<User>;
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
        },
        createdBy: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: { model: 'users', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'RESTRICT'
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


export const initRolePermissionAssociations = async () => {
  return new Promise<void>((resolve, reject) => {
    try {

      RolePermission.belongsTo(User, {
        targetKey: 'id',
        foreignKey: 'createdBy',
        as: 'createdByAuthor',
      });

      resolve();
    } catch (err) {
      reject(err);
    }
  });
};