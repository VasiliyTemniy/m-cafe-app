import type {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  Sequelize
} from 'sequelize';
import { Model, DataTypes } from 'sequelize';
import { CurrencyCode, isCurrencyCode } from '@m-cafe-app/shared-constants';


export class CurrencyConversion extends Model<InferAttributes<CurrencyConversion>, InferCreationAttributes<CurrencyConversion>> {
  declare sourceCurrencyCode: CurrencyCode;
  declare targetCurrencyCode: CurrencyCode;
  declare rate: number;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}


export const initCurrencyConversionModel = async (dbInstance: Sequelize) => {
  return new Promise<void>((resolve, reject) => {
    try {
      CurrencyConversion.init({
        sourceCurrencyCode: {
          type: DataTypes.SMALLINT,
          allowNull: false,
          validate: {
            isCurrencyCodeValidator(value: unknown) {
              if (!isCurrencyCode(value)) {
                throw new Error(`Invalid currency code: ${value}`);
              }
            }
          }
        },
        targetCurrencyCode: {
          type: DataTypes.SMALLINT,
          allowNull: false,
          validate: {
            isCurrencyCodeValidator(value: unknown) {
              if (!isCurrencyCode(value)) {
                throw new Error(`Invalid currency code: ${value}`);
              }
            }
          }
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

      // Placeholder

      resolve();
    } catch (err) {
      reject(err);
    }
  });
};