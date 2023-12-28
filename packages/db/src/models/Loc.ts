import type {
  Sequelize,
  InferAttributes,
  InferCreationAttributes,
  NonAttribute,
  ForeignKey,
  CreationOptional
} from 'sequelize';
import { LocParentType, LocType } from '@m-cafe-app/shared-constants';
import { Model, DataTypes } from 'sequelize';
import { Language } from './Language.js';
import { LocString } from './LocString.js';


export class Loc extends Model<InferAttributes<Loc>, InferCreationAttributes<Loc>> {
  declare locId: ForeignKey<LocString['id']>;
  declare languageId: ForeignKey<Language['id']>;
  declare locType: LocType;
  declare parentId: number;
  declare parentType: LocParentType;
  declare locString?: NonAttribute<LocString>;
  declare language?: NonAttribute<Language>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}


export const initLocModel = async (dbInstance: Sequelize) => {
  return new Promise<void>((resolve, reject) => {
    try {
      Loc.init({
        locId: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          references: { model: 'locs', key: 'id' },
          allowNull: false,
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
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

      Loc.belongsTo(Language, {
        targetKey: 'id',
        foreignKey: 'locId',
        as: 'loc'
      });

      Loc.belongsTo(LocString, {
        targetKey: 'id',
        foreignKey: 'locId',
        as: 'locString',
      });

      resolve();
    } catch (err) {
      reject(err);
    }
  });
};