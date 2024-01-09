import type { MigrationContext } from '../types/Migrations.js';
import { isStockEntityType, isStockStatus } from '@m-cafe-app/shared-constants';
import { DataTypes } from 'sequelize';

export const up = async ({ context: queryInterface }: MigrationContext) => {
  await queryInterface.createTable('stocks', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    facility_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'facilities', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      unique: 'unique_stock'
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
    entity_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: 'unique_stock'
    },
    entity_type: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      validate: {
        isStockEntityTypeValidator(value: unknown) {
          if (!isStockEntityType(value)) {
            throw new Error(`Invalid stock entity type: ${value}`);
          }
        }
      },
      unique: 'unique_stock'
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    status: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      validate: {
        isStockStatusValidator(value: unknown) {
          if (!isStockStatus(value)) {
            throw new Error(`Invalid stock status: ${value}`);
          }
        }
      },
      unique: 'unique_stock'
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    uniqueKeys: {
      unique_stock: {
        customIndex: true,
        fields: ['entity_id', 'entity_type', 'facility_id', 'status']
      }
    }
  });
};

export const down = async ({ context: queryInterface }: MigrationContext) => {
  await queryInterface.dropTable('stocks');
};