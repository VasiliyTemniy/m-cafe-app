import type {
  Sequelize,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  NonAttribute
} from 'sequelize';
import { DynamicModulePlacementType, DynamicModuleType, LocParentType, LocType, PictureParentType } from '@m-cafe-app/shared-constants';
import { Model, DataTypes } from 'sequelize';
import { Loc } from './Loc.js';
import { Picture } from './Picture.js';


export class DynamicModule extends Model<InferAttributes<DynamicModule>, InferCreationAttributes<DynamicModule>> {
  declare id: CreationOptional<number>;
  declare moduleType: DynamicModuleType;
  declare page: string;
  declare placement: number;
  declare placementType: DynamicModulePlacementType;
  declare className: string | null;
  declare inlineCss: string | null;
  declare url: string | null;
  declare locs?: NonAttribute<Loc[]>;
  declare pictures?: NonAttribute<Picture[]>;
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
        moduleType: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            isIn: [Object.values(DynamicModuleType)]
          }
        },
        page: {
          type: DataTypes.STRING,
          allowNull: false
        },
        placement: {
          type: DataTypes.INTEGER,
          allowNull: false
        },
        placementType: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            isIn: [Object.values(DynamicModulePlacementType)]
          },
          defaultValue: DynamicModulePlacementType.BeforeMenu,
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

      resolve();
    } catch (err) {
      reject(err);
    }
  });
};