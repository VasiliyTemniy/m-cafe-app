import type {
  Sequelize,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  NonAttribute,
  ForeignKey
} from 'sequelize';
import {
  CoverageParentType,
  PermissionAccess,
  PermissionAction,
  PermissionTarget,
  isPermissionAccess,
  isPermissionAction,
  isPermissionTarget
} from '@m-cafe-app/shared-constants';
import { Model, DataTypes } from 'sequelize';
import { Coverage } from './Coverage.js';
import { User } from './User.js';
import { Organization } from './Organization.js';


export class Permission extends Model<InferAttributes<Permission>, InferCreationAttributes<Permission>> {
  declare id: CreationOptional<number>;
  declare organizationId: ForeignKey<Organization['id']>;
  declare createdBy: ForeignKey<User['id']>;
  declare updatedBy: ForeignKey<User['id']>;
  declare target: PermissionTarget;
  declare access: PermissionAccess;
  declare action: PermissionAction;
  declare isActive: CreationOptional<boolean>;
  declare startsAt: Date | null;
  declare endsAt: Date | null;
  declare coverages?: NonAttribute<Coverage[]>;
  declare organization?: NonAttribute<Organization>;
  declare createdByAuthor?: NonAttribute<User>;
  declare updatedByAuthor?: NonAttribute<User>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

  
export const initPermissionModel = async (dbInstance: Sequelize) => {
  return new Promise<void>((resolve, reject) => {
    try {
      Permission.init({
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
        target: {
          type: DataTypes.SMALLINT,
          allowNull: false,
          validate: {
            isPermissionTargetValidator(value: unknown) {
              if (!isPermissionTarget(value)) {
                throw new Error(`Invalid permission target: ${value}`);
              }
            }
          },
        },
        // if PermissionAccess === 'byCoverage' then access is referenced from coverages
        access: {
          type: DataTypes.SMALLINT,
          allowNull: false,
          validate: {
            isPermissionAccessValidator(value: unknown) {
              if (!isPermissionAccess(value)) {
                throw new Error(`Invalid permission access: ${value}`);
              }
            }
          },
        },
        action: {
          type: DataTypes.SMALLINT,
          allowNull: false,
          validate: {
            isPermissionActionValidator(value: unknown) {
              if (!isPermissionAction(value)) {
                throw new Error(`Invalid permission action: ${value}`);
              }
            }
          },
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
        modelName: 'permissions'
      });

      resolve();
    } catch (err) {
      reject(err);
    }
  });
};


export const initPermissionAssociations = async () => {
  return new Promise<void>((resolve, reject) => {
    try {

      Permission.belongsTo(Organization, {
        targetKey: 'id',
        foreignKey: 'organizationId',
        as: 'organization',
      });

      Permission.belongsTo(User, {
        targetKey: 'id',
        foreignKey: 'createdBy',
        as: 'createdByAuthor',
      });

      Permission.belongsTo(User, {
        targetKey: 'id',
        foreignKey: 'updatedBy',
        as: 'updatedByAuthor',
      });

      Permission.hasMany(Coverage, {
        sourceKey: 'id',
        foreignKey: 'parentId',
        as: 'coverages',
        scope: {
          parentType: CoverageParentType.Permission
        },
        constraints: false,
        foreignKeyConstraint: false
      });

      resolve();
    } catch (err) {
      reject(err);
    }
  });
};