import type {
  Sequelize,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey,
  NonAttribute
} from 'sequelize';
import { Model, DataTypes } from 'sequelize';
import { LocParentType, LocType } from '@m-market-app/shared-constants';
import { Loc } from './Loc.js';
import { User } from './User.js';


export class Semantics extends Model<InferAttributes<Semantics>, InferCreationAttributes<Semantics>> {
  declare id: CreationOptional<number>;
  declare approvedBy: ForeignKey<User['id']>;
  declare technicalName: string;
  declare nameLocs?: NonAttribute<Loc[]>;
  declare descriptionLocs?: NonAttribute<Loc[]>;
  declare approvedByAppAdmin?: NonAttribute<User>;
}


export const initSemanticsModel = (dbInstance: Sequelize) => {
  return new Promise<void>((resolve, reject) => {
    try {
      Semantics.init({
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        approvedBy: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: { model: 'users', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'RESTRICT'
        },
        // name and description locs are referenced from locs table
        // technical name that should not be shown to customers and should be localized
        technicalName: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true
        }
      }, {
        sequelize: dbInstance,
        underscored: true,
        timestamps: false,
        name: {
          singular: 'semantics',
          plural: 'semantics'
        },
        modelName: 'semantics',
        tableName: 'semantics'
      });

      resolve();
    } catch (err) {
      reject(err);
    }
  });
};


export const initSemanticsAssociations = async () => {
  return new Promise<void>((resolve, reject) => {
    try {

      Semantics.hasMany(Loc, {
        foreignKey: 'parentId',
        as: 'nameLocs',
        scope: {
          parentType: LocParentType.Semantics,
          locType: LocType.Name
        },
        constraints: false,
        foreignKeyConstraint: false
      });

      Semantics.hasMany(Loc, {
        foreignKey: 'parentId',
        as: 'descriptionLocs',
        scope: {
          parentType: LocParentType.Semantics,
          locType: LocType.Description
        },
        constraints: false,
        foreignKeyConstraint: false
      });

      Semantics.belongsTo(User, {
        targetKey: 'id',
        foreignKey: 'approvedBy',
        as: 'approvedByAppAdmin'
      });

      resolve();
    } catch (err) {
      reject(err);
    }
  });
};