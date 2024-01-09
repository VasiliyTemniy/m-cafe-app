import type {
  InferAttributes,
  InferCreationAttributes,
  NonAttribute,
  Sequelize,
  CreationOptional
} from 'sequelize';
import { Model, DataTypes } from 'sequelize';
import { LocParentType, LocType, TagParentType, isTagParentType } from '@m-cafe-app/shared-constants';
import { Product } from './Product.js';
import { Picture } from './Picture.js';
import { Facility } from './Facility.js';
import { Organization } from './Organization.js';
import { Loc } from './Loc.js';


export class Tag extends Model<InferAttributes<Tag>, InferCreationAttributes<Tag>> {
  declare id: CreationOptional<number>;
  declare parentId: number;
  declare parentType: TagParentType;
  declare name: string;
  declare product?: NonAttribute<Product>;
  declare picture?: NonAttribute<Picture>;
  declare organization?: NonAttribute<Organization>;
  declare facility?: NonAttribute<Facility>;
  declare nameLocs?: NonAttribute<Loc[]>;
}


export const initTagModel = async (dbInstance: Sequelize) => {
  return new Promise<void>((resolve, reject) => {
    try {
      Tag.init({
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        parentId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        parentType: {
          type: DataTypes.SMALLINT,
          allowNull: false,
          validate: {
            isTagParentTypeValidator(value: unknown) {
              if (!isTagParentType(value)) {
                throw new Error(`Invalid tag parent type: ${value}`);
              }
            }
          },
        },
        // name locs are referenced from locs table
        name: {
          type: DataTypes.STRING,
          allowNull: false
        }
      }, {
        sequelize: dbInstance,
        underscored: true,
        timestamps: false,
        modelName: 'tag',
      });
      
      resolve();
    } catch (err) {
      reject(err);
    }
  });
};


export const initTagAssociations = async () => {
  return new Promise<void>((resolve, reject) => {
    try {

      Tag.belongsTo(Picture, {
        foreignKey: 'parentId',
        targetKey: 'id',
        as: 'picture',
        scope: {
          parentType: TagParentType.Picture
        },
        constraints: false,
        foreignKeyConstraint: false
      });

      Tag.belongsTo(Product, {
        foreignKey: 'parentId',
        targetKey: 'id',
        as: 'product',
        scope: {
          parentType: TagParentType.Product
        },
        constraints: false,
        foreignKeyConstraint: false
      });

      Tag.belongsTo(Organization, {
        foreignKey: 'parentId',
        targetKey: 'id',
        as: 'organization',
        scope: {
          parentType: TagParentType.Organization
        },
        constraints: false,
        foreignKeyConstraint: false
      });

      Tag.belongsTo(Facility, {
        foreignKey: 'parentId',
        targetKey: 'id',
        as: 'facility',
        scope: {
          parentType: TagParentType.Facility
        },
        constraints: false,
        foreignKeyConstraint: false
      });

      Tag.hasMany(Loc, {
        foreignKey: 'parentId',
        as: 'nameLocs',
        scope: {
          parentType: LocParentType.Tag,
          locType: LocType.Name
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