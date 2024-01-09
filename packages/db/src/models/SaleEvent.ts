import type {
  Sequelize,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  NonAttribute,
  ForeignKey
} from 'sequelize';
import { CoverageParentType, CurrencyCode, LocParentType, LocType, isCurrencyCode } from '@m-cafe-app/shared-constants';
import { Model, DataTypes } from 'sequelize';
import { Organization } from './Organization.js';
import { User } from './User.js';
import { Coverage } from './Coverage.js';
import { Loc } from './Loc.js';


export class SaleEvent extends Model<InferAttributes<SaleEvent>, InferCreationAttributes<SaleEvent>> {
  declare id: CreationOptional<number>;
  declare organizationId: ForeignKey<Organization['id']>;
  declare createdBy: ForeignKey<User['id']>;
  declare updatedBy: ForeignKey<User['id']>;
  declare discount: number;
  declare usedCount: number;
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
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

  
export const initSaleEventModel = async (dbInstance: Sequelize) => {
  return new Promise<void>((resolve, reject) => {
    try {
      SaleEvent.init({
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
        discount: {
          type: DataTypes.FLOAT,
          allowNull: false,
          defaultValue: 0
        },
        usedCount: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0
        },
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
        modelName: 'sale_event'
      });

      resolve();
    } catch (err) {
      reject(err);
    }
  });
};


export const initSaleEventAssociations = async () => {
  return new Promise<void>((resolve, reject) => {
    try {

      SaleEvent.belongsTo(Organization, {
        targetKey: 'id',
        foreignKey: 'organizationId',
        as: 'organization',
      });

      SaleEvent.belongsTo(User, {
        targetKey: 'id',
        foreignKey: 'createdBy',
        as: 'createdByAuthor',
      });

      SaleEvent.belongsTo(User, {
        targetKey: 'id',
        foreignKey: 'updatedBy',
        as: 'updatedByAuthor',
      });
      
      SaleEvent.hasMany(Coverage, {
        foreignKey: 'parentId',
        as: 'coverages',
        scope: {
          parentType: CoverageParentType.SaleEvent
        },
        constraints: false,
        foreignKeyConstraint: false
      });

      SaleEvent.hasMany(Loc, {
        foreignKey: 'parentId',
        as: 'nameLocs',
        scope: {
          parentType: LocParentType.SaleEvent,
          locType: LocType.Name
        },
        constraints: false,
        foreignKeyConstraint: false
      });

      SaleEvent.hasMany(Loc, {
        foreignKey: 'parentId',
        as: 'descriptionLocs',
        scope: {
          parentType: LocParentType.SaleEvent,
          locType: LocType.Description
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