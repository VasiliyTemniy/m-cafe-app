import type {
  Sequelize,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  NonAttribute
} from 'sequelize';
import { Model, DataTypes } from 'sequelize';
import { Loc } from './Loc';


export class LocString extends Model<InferAttributes<LocString>, InferCreationAttributes<LocString>> {
  declare id: CreationOptional<number>;
  declare text: string;
  declare locs?: NonAttribute<Loc[]>;
}


export const initLocStringModel = async (dbInstance: Sequelize) => {
  return new Promise<void>((resolve, reject) => {
    try {
      LocString.init({
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        text: {
          type: DataTypes.STRING(5000),
          allowNull: false
        }
      }, {
        sequelize: dbInstance,
        underscored: true,
        timestamps: false,
        modelName: 'loc_string'
      });

      resolve();
    } catch (err) {
      reject(err);
    }
  });
};


export const initLocStringAssociations = async () => {
  return new Promise<void>((resolve, reject) => {
    try {

      LocString.hasMany(Loc, {
        foreignKey: 'locStringId',
        as: 'locs',
      });

      resolve();
    } catch (err) {
      reject(err);
    }
  });
};