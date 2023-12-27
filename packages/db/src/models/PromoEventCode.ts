import type {
  Sequelize,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  NonAttribute,
  ForeignKey
} from 'sequelize';
import { Model, DataTypes } from 'sequelize';
import { User } from './User.js';
import { PromoEvent } from './PromoEvent.js';


export class PromoEventCode extends Model<InferAttributes<PromoEventCode>, InferCreationAttributes<PromoEventCode>> {
  declare id: CreationOptional<number>;
  declare promoId: ForeignKey<PromoEvent['id']>;
  declare createdBy: ForeignKey<User['id']>;
  declare updatedBy: ForeignKey<User['id']>;
  declare code: string;
  declare discount: number;
  declare priceCutAbsolute: number;
  declare isUsageLimited: boolean;
  declare usageLimit: number;
  declare usedCount: number;
  declare promo?: NonAttribute<PromoEvent>;
  declare createdByAuthor?: NonAttribute<User>;
  declare updatedByAuthor?: NonAttribute<User>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

  
export const initPromoEventCodeModel = async (dbInstance: Sequelize) => {
  return new Promise<void>((resolve, reject) => {
    try {
      PromoEventCode.init({
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        promoId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: { model: 'promo_events', key: 'id' },
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
        code: {
          type: DataTypes.STRING,
          allowNull: false
        },
        discount: {
          type: DataTypes.FLOAT,
          allowNull: false,
          defaultValue: 0
        },
        priceCutAbsolute: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0
        },
        isUsageLimited: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false
        },
        usageLimit: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0
        },
        usedCount: {
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
        modelName: 'promo_event_code'
      });

      resolve();
    } catch (err) {
      reject(err);
    }
  });
};


export const initPromoEventCodeAssociations = async () => {
  return new Promise<void>((resolve, reject) => {
    try {

      PromoEventCode.belongsTo(PromoEvent, {
        targetKey: 'id',
        foreignKey: 'promoId',
        as: 'promo'
      });

      PromoEventCode.belongsTo(User, {
        targetKey: 'id',
        foreignKey: 'createdBy',
        as: 'createdByAuthor',
      });

      PromoEventCode.belongsTo(User, {
        targetKey: 'id',
        foreignKey: 'updatedBy',
        as: 'updatedByAuthor',
      });

      resolve();
    } catch (err) {
      reject(err);
    }
  });
};