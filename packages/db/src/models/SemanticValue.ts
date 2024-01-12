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
import { Semantics } from './Semantics.js';


export class SemanticValue extends Model<InferAttributes<SemanticValue>, InferCreationAttributes<SemanticValue>> {
  declare id: CreationOptional<number>;
  declare semanticId: ForeignKey<Semantics['id']>;
  declare approvedBy: ForeignKey<User['id']>;
  declare technicalValue: string;
  declare valueLocs?: NonAttribute<Loc[]>;
  declare descriptionLocs?: NonAttribute<Loc[]>;
  declare semantics?: NonAttribute<Semantics>;
  declare approvedByAppAdmin?: NonAttribute<User>;
}


export const initSemanticValueModel = (dbInstance: Sequelize) => {
  return new Promise<void>((resolve, reject) => {
    try {
      SemanticValue.init({
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        semanticId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: { model: 'semantics', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
          unique: 'unique_semantic_value'
        },
        approvedBy: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: { model: 'users', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'RESTRICT'
        },
        // value and description locs are referenced from locs table
        // technical value that should not be shown to customers and should be localized
        technicalValue: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: 'unique_semantic_value'
        }
      }, {
        sequelize: dbInstance,
        underscored: true,
        timestamps: false,
        modelName: 'semantic_value',
        indexes: [
          {
            unique: true,
            fields: ['semantic_id', 'technical_value']
          }
        ],
      });

      resolve();
    } catch (err) {
      reject(err);
    }
  });
};


export const initSemanticValueAssociations = async () => {
  return new Promise<void>((resolve, reject) => {
    try {

      SemanticValue.belongsTo(Semantics, {
        targetKey: 'id',
        foreignKey: 'semanticId',
        as: 'semantic'
      });

      SemanticValue.hasMany(Loc, {
        foreignKey: 'parentId',
        as: 'valueLocs',
        scope: {
          parentType: LocParentType.SemanticValue,
          locType: LocType.Value
        },
        constraints: false,
        foreignKeyConstraint: false
      });

      SemanticValue.hasMany(Loc, {
        foreignKey: 'parentId',
        as: 'descriptionLocs',
        scope: {
          parentType: LocParentType.SemanticValue,
          locType: LocType.Description
        },
        constraints: false,
        foreignKeyConstraint: false
      });

      SemanticValue.belongsTo(User, {
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