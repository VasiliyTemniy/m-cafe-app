import type {
  Sequelize,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey,
  NonAttribute
} from 'sequelize';
import { Model, DataTypes } from 'sequelize';
import { Loc } from './Loc.js';
import { Product } from './Product.js';
import { LocParentType, LocType } from '@m-cafe-app/shared-constants';


export class ProductDetail extends Model<InferAttributes<ProductDetail>, InferCreationAttributes<ProductDetail>> {
  declare productId: ForeignKey<Product['id']>;
  declare nameLocs?: NonAttribute<Loc[]>;
  declare descriptionLocs?: NonAttribute<Loc[]>;
  declare product?: NonAttribute<Product>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}


export const initProductDetailModel = (dbInstance: Sequelize) => {
  return new Promise<void>((resolve, reject) => {
    try {
      ProductDetail.init({
        productId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: { model: 'products', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
        // name and description locs are referenced from locs table
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
        modelName: 'product_detail',
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


export const initProductDetailAssociations = async () => {
  return new Promise<void>((resolve, reject) => {
    try {

      ProductDetail.belongsTo(Product, {
        targetKey: 'id',
        foreignKey: 'productId',
        as: 'product'
      });

      ProductDetail.hasMany(Loc, {
        foreignKey: 'parentId',
        as: 'nameLocs',
        scope: {
          parentType: LocParentType.ProductDetail,
          locType: LocType.Name
        },
        constraints: false,
        foreignKeyConstraint: false
      });

      ProductDetail.hasMany(Loc, {
        foreignKey: 'parentId',
        as: 'descriptionLocs',
        scope: {
          parentType: LocParentType.ProductDetail,
          locType: LocType.Description
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