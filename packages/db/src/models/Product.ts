import type {
  Sequelize,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey,
  NonAttribute
} from 'sequelize';
import { Model, DataTypes } from 'sequelize';
import { LocParentType, LocType, PictureParentType, ReviewParentType, StockEntityType } from '@m-cafe-app/shared-constants';
import { ProductType } from './ProductType.js';
import { Loc } from './Loc.js';
import { ProductComponent } from './ProductComponent.js';
import { ProductCategory } from './ProductCategory.js';
import { ProductCategoryReference } from './ProductCategoryReference.js';
import { Review } from './Review.js';
import { Picture } from './Picture.js';
import { Stock } from './Stock.js';


export class Product extends Model<InferAttributes<Product>, InferCreationAttributes<Product>> {
  declare id: CreationOptional<number>;
  declare productTypeId: ForeignKey<ProductType['id']>;
  declare price: number;
  declare totalMass?: number;
  declare totalVolume?: number;
  declare boxSizingX?: number;
  declare boxSizingY?: number;
  declare boxSizingZ?: number;
  declare nameLocs?: NonAttribute<Loc[]>;
  declare descriptionLocs?: NonAttribute<Loc[]>;
  declare productType?: NonAttribute<ProductType>;
  declare productComponents?: NonAttribute<ProductComponent[]>;
  declare pictures?: NonAttribute<Picture[]>;
  declare reviews?: NonAttribute<Review[]>;
  declare categories?: NonAttribute<ProductCategory[]>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}


export const initProductModel = (dbInstance: Sequelize) => {
  return new Promise<void>((resolve, reject) => {
    try {
      Product.init({
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        // name and description locs are referenced from locs table
        productTypeId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: { model: 'product_types', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
        price: {
          type: DataTypes.INTEGER,
          allowNull: false
        },
        totalMass: {
          type: DataTypes.INTEGER,
          allowNull: true
        },
        totalVolume: {
          type: DataTypes.INTEGER,
          allowNull: true
        },
        boxSizingX: {
          type: DataTypes.INTEGER,
          allowNull: true
        },
        boxSizingY: {
          type: DataTypes.INTEGER,
          allowNull: true
        },
        boxSizingZ: {
          type: DataTypes.INTEGER,
          allowNull: true
        },
        // product categories are handled in many-many junction table
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
        modelName: 'product',
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


export const initProductAssociations = async () => {
  return new Promise<void>((resolve, reject) => {
    try {

      Product.hasMany(Loc, {
        foreignKey: 'parentId',
        as: 'nameLocs',
        scope: {
          parentType: LocParentType.Product,
          locType: LocType.Name
        },
        constraints: false,
        foreignKeyConstraint: false
      });

      Product.hasMany(Loc, {
        foreignKey: 'parentId',
        as: 'descriptionLocs',
        scope: {
          parentType: LocParentType.Product,
          locType: LocType.Description
        },
        constraints: false,
        foreignKeyConstraint: false
      });

      Product.hasMany(ProductComponent, {
        foreignKey: 'targetProductId',
        as: 'productComponents'
      });

      Product.belongsTo(ProductType, {
        foreignKey: 'productTypeId',
        as: 'productType'
      });

      Product.belongsToMany(ProductCategory, {
        through: ProductCategoryReference,
        as: 'categories',
        foreignKey: 'productId',
        otherKey: 'productCategoryId'
      });

      // Foreign key applied to Picture; Picture parentId refers to Product; Scope applied to Picture
      Product.hasMany(Picture, {
        foreignKey: 'parentId',
        as: 'pictures',
        scope: {
          parentType: PictureParentType.Product
        },
        constraints: false,
        foreignKeyConstraint: false
      });

      // Foreign key applied to Review; Review parentId refers to Product; Scope applied to Review
      Product.hasMany(Review, {
        foreignKey: 'parentId',
        as: 'reviews',
        scope: {
          parentType: ReviewParentType.Product
        },
        constraints: false,
        foreignKeyConstraint: false
      });

      // Foreign key applied to Stock; Stock entityId refers to Product; Scope applied to Stock
      // In this case, Product is a subject for Stock, association may be helpful to find all stocks of a product
      Product.hasMany(Stock, {
        foreignKey: 'entityId',
        as: 'stocks',
        scope: {
          entityType: StockEntityType.Product
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


export const initProductHooks = async () => {
  return new Promise<void>((resolve, reject) => {
    try {

      const mapComponentKey = (instance: ProductComponent) => {
        if (instance.compositeProduct && !!instance.product) {
          instance.component = instance.product;
        } else if (!instance.compositeProduct && !!instance.ingredient) {
          instance.component = instance.ingredient;
        }
        delete instance.product;
        delete instance.ingredient;
      };

      Product.addHook('afterFind', findResult => {
        if (!findResult) return;
      
        const mapProductComponents = (instance: Product) => {
          if (instance.productComponents && !!instance.productComponents) {
            for (const productComponent of instance.productComponents) {
              mapComponentKey(productComponent);
            }
            return;
          }
        };
      
        if (!Array.isArray(findResult)) {
          mapProductComponents(findResult as Product);
          return;
        }
      
        for (const instance of findResult as Product[]) {
          mapProductComponents(instance);
        }
      });

      resolve();
    } catch (err) {
      reject(err);
    }
  });
};