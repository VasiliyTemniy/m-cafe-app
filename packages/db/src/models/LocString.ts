import type { InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import type { PropertiesCreationOptional } from '@m-cafe-app/shared-constants';
import type { Sequelize } from 'sequelize';
import { Model, DataTypes } from 'sequelize';


export class LocString extends Model<InferAttributes<LocString>, InferCreationAttributes<LocString>> {
  declare id: CreationOptional<number>;
  declare mainStr: string;
  declare secStr?: string;
  declare altStr?: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}


export type LocStringData = Omit<InferAttributes<LocString>, PropertiesCreationOptional>
  & { id: number; };

  
export const initLocStringModel = async (dbInstance: Sequelize) => {
  return new Promise<void>((resolve, reject) => {
    try {
      LocString.init({
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        mainStr: {
          type: DataTypes.STRING(5000),
          allowNull: false
        },
        secStr: {
          type: DataTypes.STRING(5000),
          allowNull: true
        },
        altStr: {
          type: DataTypes.STRING(5000),
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
        modelName: 'loc_string',
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
          allWithTimestamps: {}
        }
      });

      resolve();
    } catch (err) {
      reject(err);
    }
  });
};