import type { MigrationContext } from '../types/Migrations.js';
import { isOrderConfirmationMethod, isOrderDistanceAvailability, isOrderPaymentMethod } from '@m-cafe-app/shared-constants';
import { DataTypes } from 'sequelize';

export const up = async ({ context: queryInterface }: MigrationContext) => {
  await queryInterface.createTable('order_policies', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    organization_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'organizations', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    },
    updated_by: {
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
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    payment_method: {
      type: DataTypes.SMALLINT,
      allowNull: true,
      validate: {
        isOrderPaymentMethodValidator(value: unknown) {
          if (!value) {
            return;
          }
          if (!isOrderPaymentMethod(value)) {
            throw new Error(`Invalid order payment method: ${value}`);
          }
        }
      },
    },
    confirmation_method: {
      type: DataTypes.SMALLINT,
      allowNull: true,
      validate: {
        isOrderConfirmationMethodValidator(value: unknown) {
          if (!value) {
            return;
          }
          if (!isOrderConfirmationMethod(value)) {
            throw new Error(`Invalid order confirmation method: ${value}`);
          }
        }
      },
    },
    distance_availability: {
      type: DataTypes.SMALLINT,
      allowNull: true,
      validate: {
        isOrderDistanceAvailabilityValidator(value: unknown) {
          if (!value) {
            return;
          }
          if (!isOrderDistanceAvailability(value)) {
            throw new Error(`Invalid order distance availability: ${value}`);
          }
        }
      },
    },
    starts_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    ends_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
    }
  });
};

export const down = async ({ context: queryInterface }: MigrationContext) => {
  await queryInterface.dropTable('order_policies');
};