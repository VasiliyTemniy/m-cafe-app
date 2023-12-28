import type {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  NonAttribute,
  Sequelize
} from 'sequelize';
import { Model, DataTypes } from 'sequelize';
import { LocParentType, LocType } from '@m-cafe-app/shared-constants';
import { Loc } from './Loc.js';


export class Currency extends Model<InferAttributes<Currency>, InferCreationAttributes<Currency>> {
  declare id: CreationOptional<number>;
  declare code: string;
  declare decimalMultiplier: number;
  declare nameLocs?: NonAttribute<Loc>[];
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}


export const initCurrencyModel = async (dbInstance: Sequelize) => {
  return new Promise<void>((resolve, reject) => {
    try {
      Currency.init({
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        code: {
          type: DataTypes.STRING,
          allowNull: false
        },
        decimalMultiplier: {
          type: DataTypes.INTEGER,
          allowNull: false
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false
        }
        // actual locs are referenced from locs table
      }, {
        sequelize: dbInstance,
        underscored: true,
        timestamps: true,
        modelName: 'currency',
        defaultScope: {
          attributes: {
            exclude: ['createdAt', 'updatedAt']
          }
        },
        scopes: {
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


export const initCurrencyAssociations = async () => {
  return new Promise<void>((resolve, reject) => {
    try {

      Currency.hasMany(Loc, {
        foreignKey: 'parentId',
        as: 'nameLocs',
        scope: {
          parentType: LocParentType.Currency,
          locType: LocType.Name
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