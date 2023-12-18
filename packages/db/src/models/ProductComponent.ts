import type {
  Sequelize,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey,
  NonAttribute
} from 'sequelize';
import { Model, DataTypes } from 'sequelize';
import { Product } from './Product.js';
import { Ingredient } from './Ingredient.js';


export class ProductComponent extends Model<InferAttributes<ProductComponent>, InferCreationAttributes<ProductComponent>> {
  declare id: CreationOptional<number>;
  declare targetProductId: ForeignKey<Product['id']>;
  declare componentId: number;
  declare quantity: number;
  declare compositeProduct: boolean;
  declare component?: NonAttribute<Product> | NonAttribute<Ingredient>;
  declare targetProduct?: NonAttribute<Product>;
  declare product?: NonAttribute<Product>; // Deleted in hooks; mapped to 'component'
  declare ingredient?: NonAttribute<Ingredient>; // Deleted in hooks; mapped to 'component'
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}


export const initProductComponentModel = async (dbInstance: Sequelize) => {
  return new Promise<void>((resolve, reject) => {
    try {
      ProductComponent.init({
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        targetProductId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: { model: 'products', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
        componentId: {
          type: DataTypes.INTEGER,
          allowNull: false
        },
        quantity: {
          type: DataTypes.INTEGER,
          allowNull: false
        },
        compositeProduct: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false
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
        modelName: 'product_component',
        defaultScope: {
          attributes: {
            exclude: ['createdAt', 'updatedAt']
          }
        },
        scopes: {
          compositeProduct: {
            where: {
              compositeProduct: true
            },
            attributes: {
              exclude: ['createdAt', 'updatedAt']
            }
          },
          simpleProduct: {
            where: {
              compositeProduct: false
            },
            attributes: {
              exclude: ['createdAt', 'updatedAt']
            }
          },
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


export const initProductComponentAssociations = async () => {
  return new Promise<void>((resolve, reject) => {
    try {

      // ProductComponent + Product (as target) table associations
      ProductComponent.belongsTo(Product, {
        targetKey: 'id',
        foreignKey: 'targetProductId',
        as: 'targetProduct',
      });

      // ProductComponent + Product (as component) table associations
      // Foreign key applied to ProductComponent; ProductComponent componentId refers to Product; Scope applied to ProductComponent
      ProductComponent.belongsTo(Product, {
        foreignKey: 'componentId',
        as: 'product', // Mapped to 'component' in hooks
        scope: {
          compositeProduct: true
        },
        constraints: false,
        foreignKeyConstraint: false
      });

      // ProductComponent + Ingredient (as component) table associations
      // Foreign key applied to ProductComponent; ProductComponent componentId refers to Ingredient; Scope applied to ProductComponent
      ProductComponent.belongsTo(Ingredient, {
        foreignKey: 'componentId',
        as: 'ingredient', // Mapped to 'component' in hooks
        scope: {
          compositeProduct: false
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


export const initProductComponentHooks = async () => {
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

      ProductComponent.addHook('afterFind', findResult => {
        if (!findResult) return;
      
        if (!Array.isArray(findResult)) {
          mapComponentKey(findResult as ProductComponent);
          return;
        }
      
        for (const instance of findResult as ProductComponent[]) {
          mapComponentKey(instance);
        }
      });

      resolve();
    } catch (err) {
      reject(err);
    }
  });
};