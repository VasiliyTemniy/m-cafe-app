import type {
  Sequelize,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey,
  NonAttribute
} from 'sequelize';
import { Model, DataTypes } from 'sequelize';
import { OfferType, OfferGrantMethod } from '@m-cafe-app/shared-constants';
import { User } from './User.js';
import { Organization } from './Organization.js';
import { Currency } from './Currency.js';
import { OfferBonus } from './OfferBonus.js';


export class Offer extends Model<InferAttributes<Offer>, InferCreationAttributes<Offer>> {
  declare id: CreationOptional<number>;
  declare organizationId: ForeignKey<Organization['id']>;
  declare userId: ForeignKey<User['id']>;
  declare type: OfferType;
  declare grantMethod: OfferGrantMethod;
  declare name: string;
  declare description: string;
  declare code: string;
  declare discount: number;
  declare bonusToCurrencyRate: number;
  declare bonusGainMultiplier: number;
  declare deliveryFreeThreshold: number;
  declare currencyId: ForeignKey<Currency['id']>;
  declare lastUsedAt: Date;
  declare availableAt: Date;
  declare unusedToDeactivateDiscountMs: number | null;
  declare bonusExpiracyMs: number | null;
  declare bonusAvailableAtDelayMs: number | null;
  declare grantedBy: ForeignKey<User['id']> | null;
  declare updatedBy: ForeignKey<User['id']> | null;
  declare currency?: NonAttribute<Currency>;
  declare organization?: NonAttribute<Organization>;
  declare user?: NonAttribute<User>;
  declare grantedByManager?: NonAttribute<User>;
  declare updatedByManager?: NonAttribute<User>;
  declare bonuses?: NonAttribute<OfferBonus[]>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}


export const initOfferModel = async (dbInstance: Sequelize) => {
  return new Promise<void>((resolve, reject) => {
    try {
      Offer.init({
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
          onDelete: 'CASCADE',
          unique: 'unique_offer'
        },
        userId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: { model: 'users', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
          unique: 'unique_offer'
        },
        type: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            isIn: [Object.values(OfferType)],
          },
          unique: 'unique_offer'
        },
        grantMethod: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            isIn: [Object.values(OfferGrantMethod)],
          },
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        description: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        code: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        discount: {
          type: DataTypes.FLOAT,
          allowNull: false,
          defaultValue: 0,
        },
        bonusToCurrencyRate: {
          type: DataTypes.FLOAT,
          allowNull: false,
          defaultValue: 0,
        },
        bonusGainMultiplier: {
          type: DataTypes.FLOAT,
          allowNull: false,
          defaultValue: 0,
        },
        deliveryFreeThreshold: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        currencyId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: { model: 'currencies', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        },
        lastUsedAt: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        availableAt: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        unusedToDeactivateDiscountMs: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        bonusExpiracyMs: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        bonusAvailableAtDelayMs: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        grantedBy: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: { model: 'users', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'RESTRICT',
        },
        updatedBy: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: { model: 'users', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'RESTRICT'
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
        modelName: 'offer',
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


export const initOfferAssociations = async () => {
  return new Promise<void>((resolve, reject) => {
    try {

      Offer.belongsTo(Organization, {
        targetKey: 'id',
        foreignKey: 'organizationId',
        as: 'organization',
      });
      
      Offer.belongsTo(User, {
        targetKey: 'id',
        foreignKey: 'userId',
        as: 'user',
      });

      Offer.belongsTo(User, {
        targetKey: 'id',
        foreignKey: 'grantedBy',
        as: 'grantedByManager',
      });
      
      Offer.belongsTo(User, {
        targetKey: 'id',
        foreignKey: 'updatedBy',
        as: 'updatedByManager',
      });
      
      Offer.belongsTo(Currency, {
        targetKey: 'id',
        foreignKey: 'currencyId',
        as: 'currency',
      });

      Offer.hasMany(OfferBonus, {
        sourceKey: 'id',
        foreignKey: 'offerId',
        as: 'bonuses',
      });
      
      resolve();
    } catch (err) {
      reject(err);
    }
  });
};