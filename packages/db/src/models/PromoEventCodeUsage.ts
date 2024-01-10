import type {
  Sequelize,
  InferAttributes,
  InferCreationAttributes,
  NonAttribute,
  ForeignKey
} from 'sequelize';
import { Model, DataTypes } from 'sequelize';
import { User } from './User.js';
import { PromoEventCode } from './PromoEventCode.js';


export class PromoEventCodeUsage extends
  Model<InferAttributes<PromoEventCodeUsage>, InferCreationAttributes<PromoEventCodeUsage>> {
  declare promoCodeId: ForeignKey<PromoEventCode['id']>;
  declare userId: ForeignKey<User['id']>;
  declare count: number;
  declare promoCode?: NonAttribute<PromoEventCode>;
  declare customer?: NonAttribute<User>;
}

  
export const initPromoEventCodeUsageModel = async (dbInstance: Sequelize) => {
  return new Promise<void>((resolve, reject) => {
    try {
      PromoEventCodeUsage.init({
        promoCodeId: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          allowNull: false,
          references: { model: 'promo_event_codes', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
        userId: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          allowNull: false,
          references: { model: 'users', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
        count: {
          type: DataTypes.INTEGER,
          allowNull: false
        }
      }, {
        sequelize: dbInstance,
        underscored: true,
        timestamps: false,
        modelName: 'promo_event_code_usage'
      });

      resolve();
    } catch (err) {
      reject(err);
    }
  });
};


export const initPromoEventCodeUsageAssociations = async () => {
  return new Promise<void>((resolve, reject) => {
    try {

      PromoEventCodeUsage.belongsTo(PromoEventCode, {
        targetKey: 'id',
        foreignKey: 'promoCodeId',
        as: 'promoCode'
      });

      PromoEventCodeUsage.belongsTo(User, {
        targetKey: 'id',
        foreignKey: 'userId',
        as: 'customer',
      });

      resolve();
    } catch (err) {
      reject(err);
    }
  });
};