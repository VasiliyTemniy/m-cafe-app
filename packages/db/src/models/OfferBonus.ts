import type {
  Sequelize,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey,
  NonAttribute
} from 'sequelize';
import { Model, DataTypes } from 'sequelize';
import { Offer } from './Offer.js';


export class OfferBonus extends Model<InferAttributes<OfferBonus>, InferCreationAttributes<OfferBonus>> {
  declare id: CreationOptional<number>;
  declare offerId: ForeignKey<Offer['id']>;
  declare quantity: number;
  declare usedQuantity: number;
  declare availableAt: Date;
  declare expiresAt: Date | null;
  declare offer?: NonAttribute<Offer>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}


export const initOfferBonusModel = async (dbInstance: Sequelize) => {
  return new Promise<void>((resolve, reject) => {
    try {
      OfferBonus.init({
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        offerId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: { model: 'offers', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
        quantity: {
          type: DataTypes.INTEGER,
          allowNull: false
        },
        usedQuantity: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0
        },
        availableAt: {
          type: DataTypes.DATE,
          allowNull: false
        },
        expiresAt: {
          type: DataTypes.DATE,
          allowNull: true
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
        modelName: 'offer_bonus',
        tableName: 'offer_bonuses'
      });

      resolve();
    } catch (err) {
      reject(err);
    }
  });
};


export const initOfferBonusAssociations = async () => {
  return new Promise<void>((resolve, reject) => {
    try {

      OfferBonus.belongsTo(Offer, {
        foreignKey: 'offerId',
        targetKey: 'id',
        as: 'offer'
      });
      
      resolve();
    } catch (err) {
      reject(err);
    }
  });
};