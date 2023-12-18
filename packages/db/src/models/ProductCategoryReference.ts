import type {
  Sequelize,
  InferAttributes,
  InferCreationAttributes,
  ForeignKey
} from 'sequelize';
import type { Product } from './Product.js';
import type { ProductCategory } from './ProductCategory.js';
import { Model, DataTypes } from 'sequelize';


export class ProductCategoryReference extends
  Model<InferAttributes<ProductCategoryReference>, InferCreationAttributes<ProductCategoryReference>> {
  declare productId: ForeignKey<Product['id']>;
  declare productCategoryId: ForeignKey<ProductCategory['id']>;
}


export const initProductCategoryReferenceModel = (dbInstance: Sequelize) => {
  return new Promise<void>((resolve, reject) => {
    try {
      ProductCategoryReference.init({
        productId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: { model: 'products', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
        productCategoryId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: { model: 'product_categories', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        }
      }, {
        sequelize: dbInstance,
        underscored: true,
        timestamps: false,
        modelName: 'product_category_reference',
      });

      resolve();
    } catch (err) {
      reject(err);
    }
  });
};