import type {
  Sequelize,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  NonAttribute,
} from 'sequelize';
import { CoverageParentType, PermissionAccess, PermissionAction, PermissionTarget } from '@m-cafe-app/shared-constants';
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
          // validate: {
          //   isIn: [Object.values(PermissionTarget)]
          // }
        },
        // if PermissionAccess === 'byCoverage' then access is referenced from coverages
        access: {
          type: DataTypes.SMALLINT,
          allowNull: false,
          // validate: {
          //   isIn: [Object.values(PermissionAccess)]
          // }
        },
        action: {
          type: DataTypes.SMALLINT,
          allowNull: false,
          // validate: {
          //   isIn: [Object.values(PermissionAction)]
          // }
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