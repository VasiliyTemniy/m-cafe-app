import type { MigrationContext } from '../types/Migrations.js';
// import { OrderConfirmationMethod, OrderDistanceAvailability, OrderPaymentMethod } from '@m-cafe-app/shared-constants';
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
      // validate: {
      //   isIn: [Object.values(OrderPaymentMethod)]
      // }
    },
    confirmation_method: {
      type: DataTypes.SMALLINT,
      allowNull: true,
      // validate: {
      //   isIn: [Object.values(OrderConfirmationMethod)]
      // }
    },
    distance_availability: {
      type: DataTypes.SMALLINT,
      allowNull: true,
      // validate: {
      //   isIn: [Object.values(OrderDistanceAvailability)]
      // }
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