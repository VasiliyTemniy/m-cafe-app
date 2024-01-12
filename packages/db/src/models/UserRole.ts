import type { InferAttributes, InferCreationAttributes, ForeignKey, NonAttribute } from 'sequelize';
import type { Sequelize } from 'sequelize';
import type { Role } from './Role.js';
import { User } from './User.js';
import { Model, DataTypes } from 'sequelize';


export class UserRole extends Model<InferAttributes<UserRole>, InferCreationAttributes<UserRole>> {
  declare userId: ForeignKey<User['id']>;
  declare roleId: ForeignKey<Role['id']>;
  declare grantedBy: ForeignKey<User['id']>;
  declare grantedByManager?: NonAttribute<User>;
}


export const initUserRoleModel = async (dbInstance: Sequelize) => {
  return new Promise<void>((resolve, reject) => {
    try {
      UserRole.init({
        userId: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          allowNull: false,
          references: { model: 'users', key: 'id' }
        },
        roleId: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          allowNull: false,
          references: { model: 'roles', key: 'id' }
        },
        grantedBy: {
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
        modelName: 'user_role'
      });

      resolve();
    } catch (err) {
      reject(err);
    }
  });
};


export const initUserRoleAssociations = async () => {
  return new Promise<void>((resolve, reject) => {
    try {

      UserRole.belongsTo(User, {
        targetKey: 'id',
        foreignKey: 'grantedBy',
        as: 'grantedByManager',
      });
      
      resolve();
    } catch (err) {
      reject(err);
    }
  });
};