import type {
  Sequelize,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey,
  NonAttribute
} from 'sequelize';
import { Model, DataTypes } from 'sequelize';
import {
  DetailGroupParentType,
  LocParentType,
  LocType,
  MassEnum,
  PictureParentType,
  PriceCutPermission,
  ReviewParentType,
  SizingEnum,
  StockEntityType,
  ViewParentType,
  VolumeEnum
} from '@m-cafe-app/shared-constants';
import { ProductType } from './ProductType.js';
import { Loc } from './Loc.js';
import { ProductComponent } from './ProductComponent.js';
import { ProductCategory } from './ProductCategory.js';
import { ProductCategoryReference } from './ProductCategoryReference.js';
import { Review } from './Review.js';
import { Picture } from './Picture.js';
import { Stock } from './Stock.js';
import { DetailGroup } from './DetailGroup.js';
import { User } from './User.js';
import { Organization } from './Organization.js';
import { Currency } from './Currency.js';
import { View } from './View.js';


export class Product extends Model<InferAttributes<Product>, InferCreationAttributes<Product>> {
  declare id: CreationOptional<number>;
  declare organizationId: ForeignKey<Organization['id']>;
  declare createdBy: ForeignKey<User['id']>;
  declare updatedBy: ForeignKey<User['id']>;
  declare productTypeId: ForeignKey<ProductType['id']>;
  declare price: number;
  declare currencyId: ForeignKey<Currency['id']>;
  declare priceCutPermissions: PriceCutPermission;
  declare displayPriority: number;
  declare isFeatured: boolean;
  declare isAvailable: boolean;
  declare isActive: boolean;
  declare showComponents: boolean;
  declare totalDownloads: number;
  declare pricePrefix: string | null;
  declare pricePostfix: string | null;
  declare bonusGainRate: number | null;
  declare maxDiscountCutAbsolute: number | null;
  declare maxDiscountCutRelative: number | null;
  declare maxBonusCutAbsolute: number | null;
  declare maxBonusCutRelative: number | null;
  declare maxEventCutAbsolute: number | null;
  declare maxEventCutRelative: number | null;
  declare maxTotalCutAbsolute: number | null;
  declare maxTotalCutRelative: number | null;
  declare totalMass: number | null;
  declare massMeasure: MassEnum | null;
  declare totalVolume: number | null;
  declare volumeMeasure: VolumeEnum | null;
  declare boxSizingX: number | null;
  declare boxSizingY: number | null;
  declare boxSizingZ: number | null;
  declare sizingMeasure: SizingEnum | null;
  declare nameLocs?: NonAttribute<Loc[]>;
  declare descriptionLocs?: NonAttribute<Loc[]>;
  declare productType?: NonAttribute<ProductType>;
  declare productComponents?: NonAttribute<ProductComponent[]>;
  declare pictures?: NonAttribute<Picture[]>;
  declare reviews?: NonAttribute<Review[]>;
  declare categories?: NonAttribute<ProductCategory[]>;
  declare currency?: NonAttribute<Currency>;
  declare detailGroups?: NonAttribute<DetailGroup[]>;
  declare organization?: NonAttribute<Organization>;
  declare createdByAuthor?: NonAttribute<User>;
  declare updatedByAuthor?: NonAttribute<User>;
  declare views?: NonAttribute<View[]>;
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
        organizationId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: { model: 'organizations', key: 'id' },
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
        // name and description locs are referenced from locs table
        productTypeId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: { model: 'product_types', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'RESTRICT'
        },
        price: {
          type: DataTypes.INTEGER,
          allowNull: false
        },
        currencyId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: { model: 'currencies', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'RESTRICT'
        },
        priceCutPermissions: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            isIn: [Object.values(PriceCutPermission)]
          },
          defaultValue: PriceCutPermission.None
        },
        displayPriority: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0
        },
        isFeatured: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false
        },
        isAvailable: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true
        },
        isActive: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true
        },
        showComponents: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true
        },
        totalDownloads: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0
        },
        pricePrefix: {
          type: DataTypes.STRING,
          allowNull: true
        },
        pricePostfix: {
          type: DataTypes.STRING,
          allowNull: true
        },
        bonusGainRate: {
          type: DataTypes.FLOAT,
          allowNull: true
        },
        maxDiscountCutAbsolute: {
          type: DataTypes.INTEGER,
          allowNull: true
        },
        maxDiscountCutRelative: {
          type: DataTypes.FLOAT,
          allowNull: true
        },
        maxBonusCutAbsolute: {
          type: DataTypes.INTEGER,
          allowNull: true
        },
        maxBonusCutRelative: {
          type: DataTypes.FLOAT,
          allowNull: true
        },
        maxEventCutAbsolute: {
          type: DataTypes.INTEGER,
          allowNull: true
        },
        maxEventCutRelative: {
          type: DataTypes.FLOAT,
          allowNull: true
        },
        maxTotalCutAbsolute: {
          type: DataTypes.INTEGER,
          allowNull: true
        },
        maxTotalCutRelative: {
          type: DataTypes.FLOAT,
          allowNull: true
        },
        totalMass: {
          type: DataTypes.FLOAT,
          allowNull: true
        },
        massMeasure: {
          type: DataTypes.STRING,
          allowNull: true,
          validate: {
            isIn: [Object.values(MassEnum)]
          }
        },
        totalVolume: {
          type: DataTypes.FLOAT,
          allowNull: true
        },
        volumeMeasure: {
          type: DataTypes.STRING,
          allowNull: true,
          validate: {
            isIn: [Object.values(VolumeEnum)]
          }
        },
        boxSizingX: {
          type: DataTypes.FLOAT,
          allowNull: true
        },
        boxSizingY: {
          type: DataTypes.FLOAT,
          allowNull: true
        },
        boxSizingZ: {
          type: DataTypes.FLOAT,
          allowNull: true
        },
        sizingMeasure: {
          type: DataTypes.STRING,
          allowNull: true,
          validate: {
            isIn: [Object.values(SizingEnum)]
          }
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

      Product.hasMany(DetailGroup, {
        foreignKey: 'parentId',
        as: 'detailGroups',
        scope: {
          parentType: DetailGroupParentType.Product
        },
        constraints: false,
        foreignKeyConstraint: false
      });

      Product.belongsTo(Organization, {
        targetKey: 'id',
        foreignKey: 'organizationId',
        as: 'organization',
      });

      Product.belongsTo(User, {
        targetKey: 'id',
        foreignKey: 'createdBy',
        as: 'createdByAuthor',
      });

      Product.belongsTo(User, {
        targetKey: 'id',
        foreignKey: 'updatedBy',
        as: 'updatedByAuthor',
      });

      Product.belongsTo(Currency, {
        targetKey: 'id',
        foreignKey: 'currencyId',
        as: 'currency',
      });

      Product.hasMany(View, {
        foreignKey: 'entityId',
        as: 'views',
        scope: {
          entityType: ViewParentType.Product
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