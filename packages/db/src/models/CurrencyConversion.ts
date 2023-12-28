import type {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  NonAttribute,
  ForeignKey,
  Sequelize
} from 'sequelize';
import { Model, DataTypes } from 'sequelize';
import { Currency } from './Currency.js';


export class CurrencyConversion extends Model<InferAttributes<CurrencyConversion>, InferCreationAttributes<CurrencyConversion>> {
  declare sourceId: ForeignKey<Currency['id']>;
  declare targetId: ForeignKey<Currency['id']>;
  declare rate: number;
  declare sourceCurrency?: NonAttribute<Currency>;
  declare targetCurrency?: NonAttribute<Currency>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}


export const initCurrencyConversionModel = async (dbInstance: Sequelize) => {
  return new Promise<void>((resolve, reject) => {
    try {
      CurrencyConversion.init({
        sourceId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
          references: { model: 'currencies', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
        targetId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
          references: { model: 'currencies', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
        rate: {
          type: DataTypes.DOUBLE,
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
      }, {
        sequelize: dbInstance,
        underscored: true,
        timestamps: true,
        modelName: 'currency_conversion',
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


export const initCurrencyConversionAssociations = async () => {
  return new Promise<void>((resolve, reject) => {
    try {

      CurrencyConversion.belongsTo(Currency, {
        foreignKey: 'sourceId',
        targetKey: 'id',
        as: 'sourceCurrency'
      });

      CurrencyConversion.belongsTo(Currency, {
        foreignKey: 'targetId',
        targetKey: 'id',
        as: 'targetCurrency'
      });

      resolve();
    } catch (err) {
      reject(err);
    }
  });
};