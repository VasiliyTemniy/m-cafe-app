import type {
  Sequelize,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  NonAttribute,
  ForeignKey
} from 'sequelize';
import {
  CoverageParentType,
  CurrencyCode,
  LocParentType,
  LocType,
  isCurrencyCode
} from '@m-market-app/shared-constants';
import { Model, DataTypes } from 'sequelize';
import { Organization } from './Organization.js';
import { User } from './User.js';
import { Coverage } from './Coverage.js';
import { Loc } from './Loc.js';
import { PromoEventCode } from './PromoEventCode.js';


export class PromoEvent extends Model<InferAttributes<PromoEvent>, InferCreationAttributes<PromoEvent>> {
  declare id: CreationOptional<number>;
  declare organizationId: ForeignKey<Organization['id']>;
  declare createdBy: ForeignKey<User['id']>;
  declare updatedBy: ForeignKey<User['id']>;
  declare accumulatedPriceCut: number;
  declare currencyCode: CurrencyCode;
  declare isActive: boolean;
  declare startsAt: Date | null;
  declare endsAt: Date | null;
  declare organization?: NonAttribute<Organization>;
  declare createdByAuthor?: NonAttribute<User>;
  declare updatedByAuthor?: NonAttribute<User>;
  declare coverages?: NonAttribute<Coverage[]>;
  declare nameLocs?: NonAttribute<Loc[]>;
  declare descriptionLocs?: NonAttribute<Loc[]>;
  declare codes?: NonAttribute<PromoEventCode[]>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

  
export const initPromoEventModel = async (dbInstance: Sequelize) => {
  return new Promise<void>((resolve, reject) => {
    try {
      PromoEvent.init({
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
        // coverage is referenced from coverages table
        // codes are referenced from event_promo_codes table
        // used_count is held in event_promo_code_usages table, tracked by users
        // discount and/or price_cut_absolute are held in event_promo_codes table
        accumulatedPriceCut: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0
        },
        currencyCode: {
          type: DataTypes.SMALLINT,
          allowNull: false,
          validate: {
            isCurrencyCodeValidator(value: unknown) {
              if (!isCurrencyCode(value)) {
                throw new Error(`Invalid currency code: ${value}`);
              }
            }
          }
        },
        isActive: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true
        },
        startsAt: {
          type: DataTypes.DATE,
          allowNull: true
        },
        endsAt: {
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
        modelName: 'promo_event'
      });

      resolve();
    } catch (err) {
      reject(err);
    }
  });
};


export const initPromoEventAssociations = async () => {
  return new Promise<void>((resolve, reject) => {
    try {

      PromoEvent.belongsTo(Organization, {
        targetKey: 'id',
        foreignKey: 'organizationId',
        as: 'organization',
      });

      PromoEvent.belongsTo(User, {
        targetKey: 'id',
        foreignKey: 'createdBy',
        as: 'createdByAuthor',
      });

      PromoEvent.belongsTo(User, {
        targetKey: 'id',
        foreignKey: 'updatedBy',
        as: 'updatedByAuthor',
      });
      
      PromoEvent.hasMany(Coverage, {
        foreignKey: 'parentId',
        as: 'coverages',
        scope: {
          parentType: CoverageParentType.PromoEvent
        },
        constraints: false,
        foreignKeyConstraint: false
      });

      PromoEvent.hasMany(Loc, {
        foreignKey: 'parentId',
        as: 'nameLocs',
        scope: {
          parentType: LocParentType.PromoEvent,
          locType: LocType.Name
        },
        constraints: false,
        foreignKeyConstraint: false
      });

      PromoEvent.hasMany(Loc, {
        foreignKey: 'parentId',
        as: 'descriptionLocs',
        scope: {
          parentType: LocParentType.PromoEvent,
          locType: LocType.Description
        },
        constraints: false,
        foreignKeyConstraint: false
      });

      PromoEvent.hasMany(PromoEventCode, {
        foreignKey: 'promoId',
        as: 'codes',
      });

      resolve();
    } catch (err) {
      reject(err);
    }
  });
};