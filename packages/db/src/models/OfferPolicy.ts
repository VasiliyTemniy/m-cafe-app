import type {
  Sequelize,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey,
  NonAttribute
} from 'sequelize';
import { Model, DataTypes } from 'sequelize';
import {
  CoverageParentType,
  CurrencyCode,
  OfferCodeGenerationMethod,
  OfferGrantMethod,
  OfferType,
  isCurrencyCode,
  isOfferCodeGenerationMethod,
  isOfferGrantMethod,
  isOfferType
} from '@m-cafe-app/shared-constants';
import { User } from './User.js';
import { Organization } from './Organization.js';
import { Coverage } from './Coverage.js';


export class OfferPolicy extends Model<InferAttributes<OfferPolicy>, InferCreationAttributes<OfferPolicy>> {
  declare id: CreationOptional<number>;
  declare organizationId: ForeignKey<Organization['id']>;
  declare createdBy: ForeignKey<User['id']>;
  declare updatedBy: ForeignKey<User['id']>;
  declare name: string;
  declare description: string;
  declare totalIncomeThreshold: number;
  declare categorizedIncomeThreshold: number;
  declare offerType: OfferType;
  declare offerGrantMethod: OfferGrantMethod;
  declare offerCodeGenerationMethod: OfferCodeGenerationMethod;
  declare setOfferName: string;
  declare setOfferDescription: string;
  declare setDiscount: number | null;
  declare setMsUnusedToDeactivateDiscount: number | null;
  declare addBonusQuantity: number | null;
  declare setBonusMultiplier: number | null;
  declare setBonusToCurrencyRate: number | null;
  declare setBonusExpiracyMs: number | null;
  declare setDeliveryFreeThreshold: number | null;
  declare setOfferCurrencyCode: CurrencyCode | null;
  declare setOfferAvailableAtDelayMs: number | null;
  declare setBonusAvailableAtDelayMs: number | null;
  declare isActive: CreationOptional<boolean>;
  declare startsAt: Date | null;
  declare endsAt: Date | null;
  declare organization?: NonAttribute<Organization>;
  declare createdByAuthor?: NonAttribute<User>;
  declare updatedByAuthor?: NonAttribute<User>;
  declare coverages?: NonAttribute<Coverage[]>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

  
export const initOfferPolicyModel = async (dbInstance: Sequelize) => {
  return new Promise<void>((resolve, reject) => {
    try {
      OfferPolicy.init({
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
        // coverage is referenced from coverages table
        // name and description should not be localized - internal organization business logic
        name: {
          type: DataTypes.STRING,
          allowNull: false
        },
        description: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        totalIncomeThreshold: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        categorizedIncomeThreshold: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        offerType: {
          type: DataTypes.SMALLINT,
          allowNull: false,
          validate: {
            isOfferTypeValidator(value: unknown) {
              if (!isOfferType(value)) {
                throw new Error(`Invalid offer type: ${value}`);
              }
            }
          },
        },
        offerGrantMethod: {
          type: DataTypes.SMALLINT,
          allowNull: false,
          validate: {
            isOfferGrantMethodValidator(value: unknown) {
              if (!isOfferGrantMethod(value)) {
                throw new Error(`Invalid offer grant method: ${value}`);
              }
            }
          },
        },
        offerCodeGenerationMethod: {
          type: DataTypes.SMALLINT,
          allowNull: false,
          validate: {
            isOfferCodeGenerationMethodValidator(value: unknown) {
              if (!isOfferCodeGenerationMethod(value)) {
                throw new Error(`Invalid offer code generation method: ${value}`);
              }
            }
          },
        },
        setOfferName: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        setOfferDescription: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        setDiscount: {
          type: DataTypes.FLOAT,
          allowNull: true,
        },
        setMsUnusedToDeactivateDiscount: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        addBonusQuantity: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        setBonusMultiplier: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        setBonusToCurrencyRate: {
          type: DataTypes.FLOAT,
          allowNull: true,
        },
        setBonusExpiracyMs: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        setDeliveryFreeThreshold: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        setOfferCurrencyCode: {
          type: DataTypes.SMALLINT,
          allowNull: true,
          validate: {
            isCurrencyCodeValidator(value: unknown) {
              if (!value) {
                return;
              }
              if (!isCurrencyCode(value)) {
                throw new Error(`Invalid currency code: ${value}`);
              }
            }
          }
        },
        setOfferAvailableAtDelayMs: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        setBonusAvailableAtDelayMs: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        isActive: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true
        },
        startsAt: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        endsAt: {
          type: DataTypes.DATE,
          allowNull: true,
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
        modelName: 'offer_policy'
      });

      resolve();
    } catch (err) {
      reject(err);
    }
  });
};


export const initOfferPolicyAssociations = async () => {
  return new Promise<void>((resolve, reject) => {
    try {

      OfferPolicy.belongsTo(Organization, {
        targetKey: 'id',
        foreignKey: 'organizationId',
        as: 'organization',
      });
      
      OfferPolicy.belongsTo(User, {
        targetKey: 'id',
        foreignKey: 'createdBy',
        as: 'createdByAuthor',
      });

      OfferPolicy.belongsTo(User, {
        targetKey: 'id',
        foreignKey: 'updatedBy',
        as: 'updatedByAuthor',
      });

      OfferPolicy.hasMany(Coverage, {
        foreignKey: 'parentId',
        as: 'coverages',
        scope: {
          parentType: CoverageParentType.OfferPolicy
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