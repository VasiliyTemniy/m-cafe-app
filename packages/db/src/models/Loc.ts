import type {
  Sequelize,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  NonAttribute
} from 'sequelize';
import { LocParentType, LocType } from '@m-cafe-app/shared-constants';
import { Model, DataTypes } from 'sequelize';
import { Language } from './Language.js';


export class Loc extends Model<InferAttributes<Loc>, InferCreationAttributes<Loc>> {
  declare languageId: number;
  declare locType: LocType;
  declare parentId: number;
  declare parentType: LocParentType;
  declare text: string;
  declare language?: NonAttribute<Language>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}


export const initLocModel = async (dbInstance: Sequelize) => {
  return new Promise<void>((resolve, reject) => {
    try {
      Loc.init({
        languageId: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          references: { model: 'languages', key: 'id' },
          allowNull: false,
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
        locType: {
          type: DataTypes.STRING,
          primaryKey: true,
          allowNull: false,
          validate: {
            isIn: [Object.values(LocType)]
          }
        },
        parentId: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          allowNull: false
        },
        parentType: {
          type: DataTypes.STRING,
          primaryKey: true,
          allowNull: false,
          validate: {
            isIn: [Object.values(LocParentType)]
          }
        },
        text: {
          type: DataTypes.STRING(5000),
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
        modelName: 'loc',
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


export const initLocAssociations = async () => {
  return new Promise<void>((resolve, reject) => {
    try {

      Loc.belongsTo(Language, {
        targetKey: 'id',
        foreignKey: 'languageId',
        as: 'language'
      });

      resolve();
    } catch (err) {
      reject(err);
    }
  });
};