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
import { ProductType } from './ProductType.js';
import { Product } from './Product.js';
import { ProductCategoryReference } from './ProductCategoryReference.js';
import { User } from './User.js';


export class ProductCategory extends Model<InferAttributes<ProductCategory>, InferCreationAttributes<ProductCategory>> {
  declare id: CreationOptional<number>;
  declare approvedBy: ForeignKey<User['id']> | null;
  declare name: string;
  declare productTypeId: ForeignKey<ProductType['id']>;
  declare parentCategoryId: ForeignKey<ProductCategory['id']> | null;
  declare nestLevel: number;
  declare nameLocs?: NonAttribute<Loc[]>;
  declare descriptionLocs?: NonAttribute<Loc[]>;
  declare productType?: NonAttribute<ProductType>;
  declare parentCategory?: NonAttribute<ProductCategory>;
  declare childCategories?: NonAttribute<ProductCategory[]>;
  declare products?: NonAttribute<Product[]>;
  declare approvedByAppAdmin?: NonAttribute<User>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}


export const initProductCategoryModel = (dbInstance: Sequelize) => {
  return new Promise<void>((resolve, reject) => {
    try {
      ProductCategory.init({
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
          allowNull: false
          // not unique to allow sub-categories to have the same name
        },
        productTypeId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: { model: 'product_types', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
        parentCategoryId: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: { model: 'product_categories', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
        nestLevel: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0
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
        modelName: 'product_category',
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


export const initProductCategoryAssociations = async () => {
  return new Promise<void>((resolve, reject) => {
    try {

      ProductCategory.hasMany(Loc, {
        foreignKey: 'parentId',
        as: 'nameLocs',
        scope: {
          parentType: LocParentType.ProductCategory,
          locType: LocType.Name
        },
        constraints: false,
        foreignKeyConstraint: false
      });

      ProductCategory.hasMany(Loc, {
        foreignKey: 'parentId',
        as: 'descriptionLocs',
        scope: {
          parentType: LocParentType.ProductCategory,
          locType: LocType.Description
        },
        constraints: false,
        foreignKeyConstraint: false
      });

      // target on the right side; target === parent;
      // 'parentCategoryId' is taken from the target on the right
      ProductCategory.belongsTo(ProductCategory, {
        targetKey: 'id',
        foreignKey: 'parentCategoryId',
        as: 'parentCategory'
      });

      // target on the right side; target === children;
      // 'parentCategoryId' is taken from the source on the left
      ProductCategory.hasMany(ProductCategory, {
        foreignKey: 'parentCategoryId',
        as: 'childCategories'
      });


      ProductCategory.belongsTo(ProductType, {
        targetKey: 'id',
        foreignKey: 'productTypeId',
        as: 'productType'
      });

      ProductCategory.belongsToMany(Product, {
        through: ProductCategoryReference,
        foreignKey: 'productCategoryId',
        otherKey: 'productId',
        as: 'products'
      });

      ProductCategory.belongsTo(User, {
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