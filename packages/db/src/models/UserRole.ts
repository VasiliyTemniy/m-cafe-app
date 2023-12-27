import type { InferAttributes, InferCreationAttributes, ForeignKey } from 'sequelize';
import type { Sequelize } from 'sequelize';
import type { User } from './User.js';
import type { Role } from './Role.js';
import { Model, DataTypes } from 'sequelize';


export class UserRole extends Model<InferAttributes<UserRole>, InferCreationAttributes<UserRole>> {
  declare userId: ForeignKey<User['id']>;
  declare roleId: ForeignKey<Role['id']>;
}


export const initUserRoleModel = async (dbInstance: Sequelize) => {
  return new Promise<void>((resolve, reject) => {
    try {
      UserRole.init({
        userId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: { model: 'users', key: 'id' }
        },
        roleId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: { model: 'roles', key: 'id' }
        }
      }, {
        sequelize: dbInstance,
        underscored: true,
        timestamps: false,
        modelName: 'user_role'
      });

      resolve();
    } catch (err) {
      reject(err);
    }
  });
};