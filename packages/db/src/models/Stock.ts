import type {
  Sequelize,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey,
  NonAttribute
} from 'sequelize';
import { Model, DataTypes } from 'sequelize';
import { StockStatus, StockEntityType, isStockEntityType, isStockStatus } from '@m-market-app/shared-constants';
import { DatabaseError } from '@m-market-app/utils';
import { Ingredient } from './Ingredient.js';
import { Product } from './Product.js';
import { Facility } from './Facility.js';
import { User } from './User.js';


export class Stock extends Model<InferAttributes<Stock>, InferCreationAttributes<Stock>> {
  declare id: CreationOptional<number>;
  declare facilityId: ForeignKey<Facility['id']>;
  declare createdBy: ForeignKey<User['id']>;
  declare updatedBy: ForeignKey<User['id']>;
  declare entityId: number;
  declare entityType: StockEntityType;
  declare quantity: number;
  declare status: StockStatus;
  declare facility?: NonAttribute<Facility>;
  declare entity?: NonAttribute<Ingredient | Product>;
  declare ingredient?: NonAttribute<Ingredient>; // mapped to entity in hooks
  declare product?: NonAttribute<Product>; // mapped to entity in hooks
  declare createdByAuthor?: NonAttribute<User>;
  declare updatedByAuthor?: NonAttribute<User>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}


export const initStockModel = async (dbInstance: Sequelize) => {
  return new Promise<void>((resolve, reject) => {
    try {
      Stock.init({
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        facilityId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: { model: 'facilities', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
          unique: 'unique_stock'
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
        entityId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          unique: 'unique_stock'
        },
        entityType: {
          type: DataTypes.SMALLINT,
          allowNull: false,
          validate: {
            isStockEntityTypeValidator(value: unknown) {
              if (!isStockEntityType(value)) {
                throw new Error(`Invalid stock entity type: ${value}`);
              }
            }
          },
          unique: 'unique_stock'
        },
        quantity: {
          type: DataTypes.INTEGER,
          allowNull: false
        },
        status: {
          type: DataTypes.SMALLINT,
          allowNull: false,
          validate: {
            isStockStatusValidator(value: unknown) {
              if (!isStockStatus(value)) {
                throw new Error(`Invalid stock status: ${value}`);
              }
            }
          },
          unique: 'unique_stock'
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false
        },
      }, {
        sequelize: dbInstance,
        underscored: true,
        timestamps: true,
        modelName: 'stock',
        indexes: [
          {
            unique: true,
            fields: ['entity_id', 'entity_type', 'facility_id', 'status']
          }
        ],
        defaultScope: {
          attributes: {
            exclude: ['createdAt', 'updatedAt']
          }
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


export const initStockAssociations = async () => {
  return new Promise<void>((resolve, reject) => {
    try {

      Stock.belongsTo(Facility, {
        targetKey: 'id',
        foreignKey: 'facilityId',
        as: 'facility',
      });

      // Foreign key applied to Stock; Stock entityId refers to Ingredient; Scope applied to Stock
      Stock.belongsTo(Ingredient, {
        foreignKey: 'entityId',
        as: 'ingredient',
        scope: {
          entityType: StockEntityType.Ingredient
        },
        constraints: false,
        foreignKeyConstraint: false
      });

      // Foreign key applied to Stock; Stock entityId refers to Product; Scope applied to Stock
      Stock.belongsTo(Product, {
        foreignKey: 'entityId',
        as: 'product',
        scope: {
          entityType: StockEntityType.Product
        },
        constraints: false,
        foreignKeyConstraint: false
      });

      Stock.belongsTo(User, {
        targetKey: 'id',
        foreignKey: 'createdBy',
        as: 'createdByAuthor'
      });
      
      Stock.belongsTo(User, {
        targetKey: 'id',
        foreignKey: 'updatedBy',
        as: 'updatedByAuthor'
      });
      
      resolve();
    } catch (err) {
      reject(err);
    }
  });
};


export const initStockHooks = async () => {
  return new Promise<void>((resolve, reject) => {
    try {

      const mapStockEntityKey = (instance: Stock) => {
        switch (instance.entityType) {
          case StockEntityType.Ingredient:
            if (instance.ingredient) {
              instance.entity = instance.ingredient;
            }
            break;
          case StockEntityType.Product:
            if (instance.product) {
              instance.entity = instance.product;
            }
            break;
          default:
            throw new DatabaseError(`Stock data corrupt: unknown entityType : ${instance.entityType}; instance: ${instance}`);
        }
        delete instance.product;
        delete instance.ingredient;
      };

      Stock.addHook('afterFind', findResult => {
        if (!findResult) return;
      
        if (!Array.isArray(findResult)) {
          mapStockEntityKey(findResult as Stock);
          return;
        }
      
        for (const instance of findResult as Stock[]) {
          mapStockEntityKey(instance);
        }
      });

      resolve();
    } catch (err) {
      reject(err);
    }
  });
};