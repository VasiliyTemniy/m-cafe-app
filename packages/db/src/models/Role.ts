import type {
  Sequelize,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  NonAttribute,
  ForeignKey
} from 'sequelize';
import { Model, DataTypes } from 'sequelize';
import { Organization } from './Organization.js';
import { User } from './User.js';
import { Permission } from './Permission.js';
import { RolePermission } from './RolePermission.js';


export class Role extends Model<InferAttributes<Role>, InferCreationAttributes<Role>> {
  declare id: CreationOptional<number>;
  declare organizationId: ForeignKey<Organization['id']>;
  declare createdBy: ForeignKey<User['id']>;
  declare updatedBy: ForeignKey<User['id']>;
  declare name: string;
  declare description: string;
  declare isActive: CreationOptional<boolean>;
  declare startsAt: Date | null;
  declare endsAt: Date | null;
  declare permissions?: NonAttribute<Permission[]>;
  declare organization?: NonAttribute<Organization>;
  declare createdByAuthor?: NonAttribute<User>;
  declare updatedByAuthor?: NonAttribute<User>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

  
export const initRoleModel = async (dbInstance: Sequelize) => {
  return new Promise<void>((resolve, reject) => {
    try {
      Role.init({
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        organizationId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: { model: 'organizations', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        },
        createdBy: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: { model: 'users', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'RESTRICT'
        },
        updatedBy: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: { model: 'users', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'RESTRICT'
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false
        },
        description: {
          type: DataTypes.STRING,
          allowNull: false
        },
        isActive: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true
        },
        startsAt: {
          type: DataTypes.DATE,
          allowNull: true
        },
        endsAt: {
          type: DataTypes.DATE,
          allowNull: true
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false
        }
      }, {
        sequelize: dbInstance,
        underscored: true,
        timestamps: true,
        modelName: 'role'
      });

      resolve();
    } catch (err) {
      reject(err);
    }
  });
};


export const initRoleAssociations = async () => {
  return new Promise<void>((resolve, reject) => {
    try {

      Role.belongsTo(Organization, {
        targetKey: 'id',
        foreignKey: 'organizationId',
        as: 'organization',
      });

      Role.belongsTo(User, {
        targetKey: 'id',
        foreignKey: 'createdBy',
        as: 'createdByAuthor',
      });

      Role.belongsTo(User, {
        targetKey: 'id',
        foreignKey: 'updatedBy',
        as: 'updatedByAuthor',
      });

      Role.belongsToMany(Permission, {
        through: RolePermission,
        as: 'permissions',
        foreignKey: 'roleId',
        otherKey: 'permissionId'
      });

      resolve();
    } catch (err) {
      reject(err);
    }
  });
};