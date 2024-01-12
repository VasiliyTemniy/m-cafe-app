import type {
  Sequelize,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey,
  NonAttribute
} from 'sequelize';
import { Model, DataTypes } from 'sequelize';
import { LocParentType, LocType } from '@m-cafe-app/shared-constants';
import { Loc } from './Loc.js';
import { User } from './User.js';
import { DetailGroup } from './DetailGroup.js';
import { SemanticValue } from './SemanticValue.js';


export class Detail extends Model<InferAttributes<Detail>, InferCreationAttributes<Detail>> {
  declare id: CreationOptional<number>;
  declare detailGroupId: ForeignKey<DetailGroup['id']>;
  declare createdBy: ForeignKey<User['id']>;
  declare updatedBy: ForeignKey<User['id']>;
  declare semanticValueId: ForeignKey<SemanticValue['id']> | null;
  declare semanticValueNumeric: number | null;
  declare nameLocs?: NonAttribute<Loc[]>;
  declare valueLocs?: NonAttribute<Loc[]>;
  declare semanticValue?: NonAttribute<SemanticValue>;
  declare detailGroup?: NonAttribute<DetailGroup>;
  declare createdByAuthor?: NonAttribute<User>;
  declare updatedByAuthor?: NonAttribute<User>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}


export const initDetailModel = (dbInstance: Sequelize) => {
  return new Promise<void>((resolve, reject) => {
    try {
      Detail.init({
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        detailGroupId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: { model: 'detail_groups', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
        createdBy: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: { model: 'users', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'RESTRICT'
        },
        updatedBy: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: { model: 'users', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'RESTRICT'
        },
        // name and value locs are referenced from locs table
        // Search and filter for Products can be done through semantic values
        semanticValueId: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: { model: 'semantic_values', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'RESTRICT'
        },
        // Semantic value numeric is a supplementary column that can represent, e.g. 1000 rpm for some engines or 270.5 C as a melting point for some materials
        // If null, semantic value numeric is not applicable
        semanticValueNumeric: {
          type: DataTypes.FLOAT,
          allowNull: true
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
        modelName: 'detail',
        defaultScope: {
          attributes: {
            exclude: ['createdAt', 'updatedAt']
          },
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


export const initDetailAssociations = async () => {
  return new Promise<void>((resolve, reject) => {
    try {

      Detail.hasMany(Loc, {
        foreignKey: 'parentId',
        as: 'nameLocs',
        scope: {
          parentType: LocParentType.Detail,
          locType: LocType.Name
        },
        constraints: false,
        foreignKeyConstraint: false
      });

      Detail.hasMany(Loc, {
        foreignKey: 'parentId',
        as: 'valueLocs',
        scope: {
          parentType: LocParentType.Detail,
          locType: LocType.Value
        },
        constraints: false,
        foreignKeyConstraint: false
      });

      Detail.belongsTo(User, {
        targetKey: 'id',
        foreignKey: 'createdBy',
        as: 'createdByAuthor'
      });
      
      Detail.belongsTo(User, {
        targetKey: 'id',
        foreignKey: 'updatedBy',
        as: 'updatedByAuthor'
      });

      Detail.belongsTo(DetailGroup, {
        targetKey: 'id',
        foreignKey: 'detailGroupId',
        as: 'detailGroup',
      });

      Detail.belongsTo(SemanticValue, {
        targetKey: 'id',
        foreignKey: 'semanticValueId',
        as: 'semanticValue'
      });

      resolve();
    } catch (err) {
      reject(err);
    }
  });
};