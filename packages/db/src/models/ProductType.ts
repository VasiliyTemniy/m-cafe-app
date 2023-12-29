import type {
  Sequelize,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  NonAttribute,
  ForeignKey
} from 'sequelize';
import { Model, DataTypes } from 'sequelize';
import { LocParentType, LocType } from '@m-cafe-app/shared-constants';
import { Loc } from './Loc.js';
import { ProductCategory } from './ProductCategory.js';
import { Product } from './Product.js';
import { User } from './User.js';


export class ProductType extends Model<InferAttributes<ProductType>, InferCreationAttributes<ProductType>> {
  declare id: CreationOptional<number>;
  declare approvedBy: ForeignKey<User['id']> | null;
  declare name: string;
  declare nameLocs?: NonAttribute<Loc[]>;
  declare descriptionLocs?: NonAttribute<Loc[]>;
  declare categories?: NonAttribute<ProductCategory[]>;
  declare products?: NonAttribute<Product[]>;
  declare approvedByAppAdmin?: NonAttribute<User>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}


export const initProductTypeModel = (dbInstance: Sequelize) => {
  return new Promise<void>((resolve, reject) => {
    try {
      ProductType.init({
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
        name: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true
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
        modelName: 'product_type',
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


export const initProductTypeAssociations = async () => {
  return new Promise<void>((resolve, reject) => {
    try {

      ProductType.hasMany(Loc, {
        foreignKey: 'parentId',
        as: 'nameLocs',
        scope: {
          parentType: LocParentType.ProductType,
          locType: LocType.Name
        },
        constraints: false,
        foreignKeyConstraint: false
      });

      ProductType.hasMany(Loc, {
        foreignKey: 'parentId',
        as: 'descriptionLocs',
        scope: {
          parentType: LocParentType.ProductType,
          locType: LocType.Description
        },
        constraints: false,
        foreignKeyConstraint: false
      });

      ProductType.hasMany(ProductCategory, {
        foreignKey: 'productTypeId',
        as: 'categories'
      });

      ProductType.hasMany(Product, {
        foreignKey: 'productTypeId',
        as: 'products'
      });

      ProductType.belongsTo(User, {
        foreignKey: 'approvedBy',
        as: 'approvedByAppAdmin'
      });

      resolve();
    } catch (err) {
      reject(err);
    }
  });
};