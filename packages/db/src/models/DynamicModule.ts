import type {
  Sequelize,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  NonAttribute,
  ForeignKey
} from 'sequelize';
import {
  DynamicModulePlacementType,
  DynamicModulePreset,
  DynamicModuleType,
  LocParentType,
  LocType,
  PictureParentType,
  isDynamicModulePlacementType,
  isDynamicModulePreset,
  isDynamicModuleType
} from '@m-market-app/shared-constants';
import { Model, DataTypes } from 'sequelize';
import { Loc } from './Loc.js';
import { Picture } from './Picture.js';
import { DynamicModulePage } from './DynamicModulePage.js';
import { Organization } from './Organization.js';
import { User } from './User.js';


export class DynamicModule extends Model<InferAttributes<DynamicModule>, InferCreationAttributes<DynamicModule>> {
  declare id: CreationOptional<number>;
  declare organizationId: ForeignKey<Organization['id']> | null; // if null, it means it is a global module
  declare createdBy: ForeignKey<User['id']>;
  declare updatedBy: ForeignKey<User['id']>;
  declare moduleType: DynamicModuleType;
  declare placement: number;
  declare placementType: DynamicModulePlacementType;
  declare nestLevel: number;
  declare preset: DynamicModulePreset | null;
  declare className: string | null;
  declare inlineCss: string | null;
  declare url: string | null;
  declare parentDynamicModuleId: ForeignKey<DynamicModule['id']> | null;
  declare locs?: NonAttribute<Loc[]>;
  declare pictures?: NonAttribute<Picture[]>;
  declare parentDynamicModule?: NonAttribute<DynamicModule>;
  declare childDynamicModules?: NonAttribute<DynamicModule[]>;
  declare pages?: NonAttribute<DynamicModulePage[]>;
  declare organization?: NonAttribute<Organization>;
  declare createdByAuthor?: NonAttribute<User>;
  declare updatedByAuthor?: NonAttribute<User>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}


export const initDynamicModuleModel = async (dbInstance: Sequelize) => {
  return new Promise<void>((resolve, reject) => {
    try {
      DynamicModule.init({
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        organizationId: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: { model: 'organizations', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
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
        moduleType: {
          type: DataTypes.SMALLINT,
          allowNull: false,
          validate: {
            isDynamicModuleTypeValidator(value: unknown) {
              if (!isDynamicModuleType(value)) {
                throw new Error(`Invalid dynamic module type: ${value}`);
              }
            }
          },
        },
        placement: {
          type: DataTypes.INTEGER,
          allowNull: false
        },
        placementType: {
          type: DataTypes.SMALLINT,
          allowNull: false,
          validate: {
            isDynamicModulePlacementTypeValidator(value: unknown) {
              if (!isDynamicModulePlacementType(value)) {
                throw new Error(`Invalid dynamic module placement type: ${value}`);
              }
            }
          },
          defaultValue: DynamicModulePlacementType.BeforeMenu,
        },
        nestLevel: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0
        },
        preset: {
          type: DataTypes.SMALLINT,
          allowNull: true,
          validate: {
            isDynamicModulePresetValidator(value: unknown) {
              if (!value) {
                return;
              }
              if (!isDynamicModulePreset(value)) {
                throw new Error(`Invalid dynamic module preset: ${value}`);
              }
            }
          },
        },
        className: {
          type: DataTypes.STRING,
          allowNull: true
        },
        inlineCss: {
          type: DataTypes.STRING,
          allowNull: true
        },
        url: {
          type: DataTypes.STRING,
          allowNull: true
        },
        parentDynamicModuleId: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: { model: 'dynamic_modules', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false
        },
      }, {
        sequelize: dbInstance,
        underscored: true,
        timestamps: true,
        modelName: 'dynamic_module',
        defaultScope: {
          attributes: {
            exclude: ['createdAt', 'updatedAt']
          }
        },
        scopes: {
          all: {
            attributes: {
              exclude: ['createdAt', 'updatedAt']
            }
          },
          raw: {
            attributes: {
              exclude: ['createdAt', 'updatedAt']
            }
          },
          allWithTimestamps: {}
        }
      });

      resolve();
    } catch (err) {
      reject(err);
    }
  });
};


export const initDynamicModuleAssociations = async () => {
  return new Promise<void>((resolve, reject) => {
    try {

      DynamicModule.hasMany(Loc, {
        foreignKey: 'parentId',
        as: 'loc',
        scope: {
          parentType: LocParentType.DynamicModule,
          locType: LocType.Text
        },
        constraints: false,
        foreignKeyConstraint: false
      });

      DynamicModule.hasMany(Picture, {
        foreignKey: 'parentId',
        as: 'pictures',
        scope: {
          parentType: PictureParentType.DynamicModule
        },
        constraints: false,
        foreignKeyConstraint: false
      });

      DynamicModule.hasMany(DynamicModulePage, {
        foreignKey: 'dynamicModuleId',
        as: 'dynamicModulePages',
      });

      // target on the right side; target === parent;
      // 'parentDynamicModuleId' is taken from the target on the right
      DynamicModule.belongsTo(DynamicModule, {
        targetKey: 'id',
        foreignKey: 'parentDynamicModuleId',
        as: 'parentDynamicModule'
      });

      // target on the right side; target === children;
      // 'parentDynamicModuleId' is taken from the source on the left
      DynamicModule.hasMany(DynamicModule, {
        foreignKey: 'parentDynamicModuleId',
        as: 'childDynamicModules'
      });

      DynamicModule.belongsTo(Organization, {
        targetKey: 'id',
        foreignKey: 'organizationId',
        as: 'organization',
      });

      DynamicModule.belongsTo(User, {
        targetKey: 'id',
        foreignKey: 'createdBy',
        as: 'createdByAuthor',
      });

      DynamicModule.belongsTo(User, {
        targetKey: 'id',
        foreignKey: 'updatedBy',
        as: 'updatedByAuthor',
      });

      resolve();
    } catch (err) {
      reject(err);
    }
  });
};