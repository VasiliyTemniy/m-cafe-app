import type { InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey } from 'sequelize';
import type { PropertiesCreationOptional } from '@m-cafe-app/shared-constants';
import type { Sequelize } from 'sequelize';
import { Model, DataTypes } from 'sequelize';
import { Facility } from './Facility.js';
import { Ingredient } from './Ingredient.js';


export class Stock extends Model<InferAttributes<Stock>, InferCreationAttributes<Stock>> {
  declare id: CreationOptional<number>;
  declare ingredientId: ForeignKey<Ingredient['id']>;
  declare facilityId: ForeignKey<Facility['id']>;
  declare quantity: number;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}


export type StockData = Omit<InferAttributes<Stock>, PropertiesCreationOptional>
& { id: number; };


export const initStockModel = async (dbInstance: Sequelize) => {
  return new Promise<void>((resolve, reject) => {
    try {
      Stock.init({
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        ingredientId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: { model: 'ingredients', key: 'id' },
          unique: 'unique_stock'
        },
        facilityId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: { model: 'facilities', key: 'id' },
          unique: 'unique_stock'
        },
        quantity: {
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
        },
      }, {
        sequelize: dbInstance,
        underscored: true,
        timestamps: true,
        modelName: 'stock',
        indexes: [
          {
            unique: true,
            fields: ['ingredient_id', 'facility_id']
          }
        ],
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