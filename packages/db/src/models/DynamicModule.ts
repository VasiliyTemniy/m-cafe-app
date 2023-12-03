import type { InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey, NonAttribute } from 'sequelize';
import type { PropertiesCreationOptional } from '@m-cafe-app/shared-constants';
import type { Sequelize } from 'sequelize';
import { Model, DataTypes } from 'sequelize';
import { LocString } from './LocString.js';
import { Picture } from './Picture.js';


export class DynamicModule extends Model<InferAttributes<DynamicModule>, InferCreationAttributes<DynamicModule>> {
  declare id: CreationOptional<number>;
  declare moduleType: string;
  declare locStringId?: ForeignKey<LocString['id']> | null;
  declare page: string;
  declare placement: number;
  declare placementType: CreationOptional<string>;
  declare className?: string;
  declare inlineCss?: string;
  declare pictureId?: ForeignKey<Picture['id']> | null;
  declare url?: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare locString?: NonAttribute<LocString>;
  declare picture?: NonAttribute<Picture>;
}


export type DynamicModuleData = Omit<InferAttributes<DynamicModule>, PropertiesCreationOptional>
  & { id: number; };


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
          allowNull: false
        },
        locStringId: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: { model: 'loc_strings', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL'
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
          defaultValue: 'afterMenuPicFirst'
        }, 
        className: {
          type: DataTypes.STRING,
          allowNull: true
        },
        inlineCss: {
          type: DataTypes.STRING,
          allowNull: true
        },
        pictureId: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: { model: 'pictures', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL'
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