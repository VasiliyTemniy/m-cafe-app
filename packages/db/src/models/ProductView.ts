import type {
  InferAttributes,
  InferCreationAttributes,
  ForeignKey,
  NonAttribute,
  Sequelize
} from 'sequelize';
import { Model, DataTypes } from 'sequelize';
import { Picture } from './Picture.js';


export class ProductView extends Model<InferAttributes<ProductView>, InferCreationAttributes<ProductView>> {
  declare userIp: string;
  declare productId: ForeignKey<Picture['id']>;
  declare count: number;
  declare product?: NonAttribute<Picture>;
}


export const initProductViewModel = async (dbInstance: Sequelize) => {
  return new Promise<void>((resolve, reject) => {
    try {
      ProductView.init({
        userIp: {
          type: DataTypes.STRING,
          primaryKey: true,
          allowNull: false
        },
        productId: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          allowNull: false,
          references: { model: 'products', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
        count: {
          type: DataTypes.INTEGER,
          allowNull: false,
        }
      }, {
        sequelize: dbInstance,
        underscored: true,
        timestamps: false,
        modelName: 'product_view',
      });
      
      resolve();
    } catch (err) {
      reject(err);
    }
  });
};


export const initProductViewAssociations = async () => {
  return new Promise<void>((resolve, reject) => {
    try {

      ProductView.belongsTo(Picture, {
        foreignKey: 'productId',
        targetKey: 'id',
        as: 'product'
      });

      resolve();
    } catch (err) {
      reject(err);
    }
  });
};