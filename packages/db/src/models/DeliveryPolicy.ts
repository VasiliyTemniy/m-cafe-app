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
  DeliveryCostCalculationType,
  MassMeasure,
  SizingMeasure,
  VolumeMeasure,
  isDeliveryCostCalculationType,
  isMassMeasure,
  isSizingMeasure,
  isVolumeMeasure
} from '@m-cafe-app/shared-constants';
import { User } from './User.js';
import { Organization } from './Organization.js';
import { Coverage } from './Coverage.js';


export class DeliveryPolicy extends Model<InferAttributes<DeliveryPolicy>, InferCreationAttributes<DeliveryPolicy>> {
  declare id: CreationOptional<number>;
  declare organizationId: ForeignKey<Organization['id']>;
  declare createdBy: ForeignKey<User['id']>;
  declare updatedBy: ForeignKey<User['id']>;
  declare name: string;
  declare description: string;
  declare deliveryCostCalculationType: DeliveryCostCalculationType;
  declare fixedCostAddon: number | null;
  declare distanceStepCost: number | null;
  declare distanceStepQuantity: number | null;
  declare distanceStepMeasure: SizingMeasure | null;
  declare massStepCost: number | null;
  declare massStepQuantity: number | null;
  declare massStepMeasure: MassMeasure | null;
  declare volumeStepCost: number | null;
  declare volumeStepQuantity: number | null;
  declare volumeStepMeasure: VolumeMeasure | null;
  declare startsAt: Date | null;
  declare endsAt: Date | null;
  declare isActive: boolean;
  declare organization?: NonAttribute<Organization>;
  declare createdByAuthor?: NonAttribute<User>;
  declare updatedByAuthor?: NonAttribute<User>;
  declare coverages?: NonAttribute<Coverage[]>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

  
export const initDeliveryPolicyModel = async (dbInstance: Sequelize) => {
  return new Promise<void>((resolve, reject) => {
    try {
      DeliveryPolicy.init({
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
        deliveryCostCalculationType: {
          type: DataTypes.SMALLINT,
          allowNull: false,
          validate: {
            isDeliveryCostCalculationTypeValidator(value: unknown) {
              if (!isDeliveryCostCalculationType(value)) {
                throw new Error(`Invalid delivery cost calculation type: ${value}`);
              }
            }
          },
        },
        fixedCostAddon: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        distanceStepCost: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        distanceStepQuantity: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        distanceStepMeasure: {
          type: DataTypes.SMALLINT,
          allowNull: true,
          validate: {
            isSizingMeasureValidator(value: unknown) {
              if (!value) {
                return;
              }
              if (!isSizingMeasure(value)) {
                throw new Error(`Invalid sizing measure: ${value}`);
              }
            }
          },
        },
        massStepCost: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        massStepQuantity: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        massStepMeasure: {
          type: DataTypes.SMALLINT,
          allowNull: true,
          validate: {
            isMassMeasureValidator(value: unknown) {
              if (!value) {
                return;
              }
              if (!isMassMeasure(value)) {
                throw new Error(`Invalid mass measure: ${value}`);
              }
            }
          },
        },
        volumeStepCost: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        volumeStepQuantity: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        volumeStepMeasure: {
          type: DataTypes.SMALLINT,
          allowNull: true,
          validate: {
            isVolumeMeasureValidator(value: unknown) {
              if (!value) {
                return;
              }
              if (!isVolumeMeasure(value)) {
                throw new Error(`Invalid volume measure: ${value}`);
              }
            }
          },
        },
        startsAt: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        endsAt: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        isActive: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true
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
        modelName: 'delivery_policy'
      });

      resolve();
    } catch (err) {
      reject(err);
    }
  });
};


export const initDeliveryPolicyAssociations = async () => {
  return new Promise<void>((resolve, reject) => {
    try {

      DeliveryPolicy.belongsTo(Organization, {
        targetKey: 'id',
        foreignKey: 'organizationId',
        as: 'organization',
      });
      
      DeliveryPolicy.belongsTo(User, {
        targetKey: 'id',
        foreignKey: 'createdBy',
        as: 'createdByAuthor',
      });

      DeliveryPolicy.belongsTo(User, {
        targetKey: 'id',
        foreignKey: 'updatedBy',
        as: 'updatedByAuthor',
      });

      DeliveryPolicy.hasMany(Coverage, {
        foreignKey: 'parentId',
        as: 'coverages',
        scope: {
          parentType: CoverageParentType.DeliveryPolicy
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