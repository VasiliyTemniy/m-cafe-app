import type {
  InferAttributes,
  InferCreationAttributes,
  NonAttribute,
  Sequelize,
  CreationOptional,
  ForeignKey
} from 'sequelize';
import { Model, DataTypes } from 'sequelize';
import { LocParentType, LocType, TagParentType } from '@m-cafe-app/shared-constants';
import { Product } from './Product.js';
import { Picture } from './Picture.js';
import { Facility } from './Facility.js';
import { Organization } from './Organization.js';
import { Loc } from './Loc.js';
import { User } from './User.js';
import { TagRelation } from './TagRelation.js';


export class Tag extends Model<InferAttributes<Tag>, InferCreationAttributes<Tag>> {
  declare id: CreationOptional<number>;
  declare approvedBy: ForeignKey<User['id']> | null;
  declare name: string;
  declare product?: NonAttribute<Product>;
  declare picture?: NonAttribute<Picture>;
  declare organization?: NonAttribute<Organization>;
  declare facility?: NonAttribute<Facility>;
  declare nameLocs?: NonAttribute<Loc[]>;
  declare approvedByAuthor?: NonAttribute<User>;
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
        approvedBy: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: { model: 'users', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'RESTRICT'
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

      Tag.belongsToMany(Picture, {
        through: {
          model: TagRelation,
          scope: {
            parentType: TagParentType.Picture
          }
        },
        foreignKey: 'tagId',
        otherKey: 'parentId',
        as: 'picture',
        constraints: false,
        foreignKeyConstraint: false
      });

      Tag.belongsToMany(Product, {
        through: {
          model: TagRelation,
          scope: {
            parentType: TagParentType.Product
          }
        },
        foreignKey: 'tagId',
        otherKey: 'parentId',
        as: 'product',
        constraints: false,
        foreignKeyConstraint: false
      });

      Tag.belongsToMany(Organization, {
        through: {
          model: TagRelation,
          scope: {
            parentType: TagParentType.Organization
          }
        },
        foreignKey: 'tagId',
        otherKey: 'parentId',
        as: 'organization',
        constraints: false,
        foreignKeyConstraint: false
      });

      Tag.belongsToMany(Facility, {
        through: {
          model: TagRelation,
          scope: {
            parentType: TagParentType.Facility
          }
        },
        as: 'facility',
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

      Tag.belongsTo(User, {
        targetKey: 'id',
        foreignKey: 'approvedBy',
        as: 'approvedByAppAdmin',
      });

      resolve();
    } catch (err) {
      reject(err);
    }
  });
};