import type {
  Sequelize,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  NonAttribute
} from 'sequelize';
import { Model, DataTypes } from 'sequelize';
import { LocParentType, LocType } from '@m-cafe-app/shared-constants';
import { Loc } from './Loc.js';


export class Language extends Model<InferAttributes<Language>, InferCreationAttributes<Language>> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare code: string;
  declare nameLocs?: NonAttribute<Loc[]>;
}

  
export const initLanguageModel = async (dbInstance: Sequelize) => {
  return new Promise<void>((resolve, reject) => {
    try {
      Language.init({
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false
        },
        code: {
          type: DataTypes.STRING,
          allowNull: false
        }
      }, {
        sequelize: dbInstance,
        underscored: true,
        timestamps: false,
        modelName: 'language'
      });

      resolve();
    } catch (err) {
      reject(err);
    }
  });
};


export const initLanguageAssociations = async () => {
  return new Promise<void>((resolve, reject) => {
    try {

      Language.hasMany(Loc, {
        foreignKey: 'languageId',
        as: 'nameLocs',
        scope: {
          locType: LocType.Name,
          parentType: LocParentType.Language
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