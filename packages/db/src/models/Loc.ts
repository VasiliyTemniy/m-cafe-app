import type {
  Sequelize,
  InferAttributes,
  InferCreationAttributes,
  NonAttribute,
  ForeignKey,
  CreationOptional
} from 'sequelize';
import { LanguageCode, LocParentType, LocType, isLanguageCode, isLocParentType, isLocType } from '@m-market-app/shared-constants';
import { Model, DataTypes } from 'sequelize';
import { LocString } from './LocString.js';


export class Loc extends Model<InferAttributes<Loc>, InferCreationAttributes<Loc>> {
  declare locStringId: ForeignKey<LocString['id']>;
  declare languageCode: LanguageCode;
  declare locType: LocType;
  declare parentId: number;
  declare parentType: LocParentType;
  declare locString?: NonAttribute<LocString>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}


export const initLocModel = async (dbInstance: Sequelize) => {
  return new Promise<void>((resolve, reject) => {
    try {
      Loc.init({
        locStringId: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          references: { model: 'loc_strings', key: 'id' },
          allowNull: false,
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
        languageCode: {
          type: DataTypes.SMALLINT,
          primaryKey: true,
          allowNull: false,
          validate: {
            isLanguageCodeValidator(value: unknown) {
              if (!isLanguageCode(value)) {
                throw new Error(`Invalid language code: ${value}`);
              }
            }
          }
        },
        locType: {
          type: DataTypes.SMALLINT,
          primaryKey: true,
          allowNull: false,
          validate: {
            isLocTypeValidator(value: unknown) {
              if (!isLocType(value)) {
                throw new Error(`Invalid loc type: ${value}`);
              }
            }
          }
        },
        parentId: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          allowNull: false
        },
        parentType: {
          type: DataTypes.SMALLINT,
          primaryKey: true,
          allowNull: false,
          validate: {
            isLocParentTypeValidator(value: unknown) {
              if (!isLocParentType(value)) {
                throw new Error(`Invalid loc parent type: ${value}`);
              }
            }
          }
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
        modelName: 'loc',
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


export const initLocAssociations = async () => {
  return new Promise<void>((resolve, reject) => {
    try {

      Loc.belongsTo(LocString, {
        targetKey: 'id',
        foreignKey: 'locStringId',
        as: 'locString',
      });

      resolve();
    } catch (err) {
      reject(err);
    }
  });
};