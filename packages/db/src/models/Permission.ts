import type {
  Sequelize,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  NonAttribute,
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


export class Permission extends Model<InferAttributes<Permission>, InferCreationAttributes<Permission>> {
  declare id: CreationOptional<number>;
  declare target: PermissionTarget;
  declare access: PermissionAccess;
  declare action: PermissionAction;
  declare isActive: boolean;
  declare startsAt: Date | null;
  declare endsAt: Date | null;
  declare coverages?: NonAttribute<Coverage[]>;
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