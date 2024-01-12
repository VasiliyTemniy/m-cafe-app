import type {
  InferAttributes,
  InferCreationAttributes,
  Sequelize
} from 'sequelize';
import { Model, DataTypes } from 'sequelize';

/**
 * This model fixates each enum key-value pairs to prevent enum values from being messed up after some app updates/fixes\
 * On each server start, cycle through all the enums, getByPk({ name: enumName, key: enumKey }), check if the value is still valid,
 * add new key-value pair if it's not there
 */
export class FixedEnum extends Model<InferAttributes<FixedEnum>, InferCreationAttributes<FixedEnum>> {
  declare name: string;
  declare key: string;
  declare value: string;
}


export const initFixedEnumModel = async (dbInstance: Sequelize) => {
  return new Promise<void>((resolve, reject) => {
    try {
      FixedEnum.init({
        name: {
          type: DataTypes.STRING,
          primaryKey: true,
          allowNull: false,
        },
        key: {
          type: DataTypes.STRING,
          primaryKey: true,
          allowNull: false,
        },
        value: {
          type: DataTypes.STRING,
          allowNull: false,
        }
      }, {
        sequelize: dbInstance,
        underscored: true,
        timestamps: false,
        modelName: 'fixed_enum',
      });
      
      resolve();
    } catch (err) {
      reject(err);
    }
  });
};