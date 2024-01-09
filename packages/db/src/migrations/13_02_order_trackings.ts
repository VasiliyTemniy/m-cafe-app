import type { MigrationContext } from '../types/Migrations.js';
import { DataTypes, QueryTypes } from 'sequelize';
import { OrderTrackingStatus, isMassMeasure, isOrderTrackingStatus } from '@m-cafe-app/shared-constants';

export const up = async ({ context: queryInterface }: MigrationContext) => {
  await queryInterface.createTable('order_trackings', {
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'orders', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    facility_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'facilities', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    status: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      validate: {
        isOrderTrackingStatusValidator(value: unknown) {
          if (!isOrderTrackingStatus(value)) {
            throw new Error(`Invalid order tracking status: ${value}`);
          }
        }
      },
      defaultValue: OrderTrackingStatus.Acquired
    },
    point_number: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    estimated_delivery_at: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: true
      }
    },
    mass_control_value: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    mass_measure: {
      type: DataTypes.SMALLINT,
      allowNull: true,
      validate: {
        isMassMeasureValidator(value: unknown) {
          if (!isMassMeasure(value)) {
            throw new Error(`Invalid mass measure: ${value}`);
          }
        }
      },
    },
    delivered_at: {
      type: DataTypes.DATE,
      allowNull: true,
      validate: {
        isDate: true
      }
    },
    carrier_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'facilities', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false
    }
  });

  const constraintCheck = await queryInterface.sequelize.query(
    "SELECT * FROM pg_constraint WHERE conname = 'order_trackings_pkey'",
    { type: QueryTypes.SELECT }
  );

  if (!constraintCheck[0]) {
    await queryInterface.addConstraint('order_trackings', {
      fields: [
        'order_id', 'facility_id', 'point_number'
      ],
      type: 'primary key',
      name: 'order_trackings_pkey'
    });
  }
};

export const down = async ({ context: queryInterface }: MigrationContext) => {
  await queryInterface.dropTable('order_trackings');
};