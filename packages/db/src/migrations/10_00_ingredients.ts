import type { MigrationContext } from '../types/Migrations.js';
import { isCurrencyCode } from '@m-cafe-app/shared-constants';
import { DataTypes } from 'sequelize';

export const up = async ({ context: queryInterface }: MigrationContext) => {
  await queryInterface.createTable('ingredients', {
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
      onDelete: 'CASCADE'
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
    // name, description and stock measure locs are referenced from locs table
    price: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    currency_code: {
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
    unit_mass: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    unit_volume: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    proteins: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    fats: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    carbohydrates: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    calories: {
      type: DataTypes.INTEGER,
      allowNull: true
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
};

export const down = async ({ context: queryInterface }: MigrationContext) => {
  await queryInterface.dropTable('ingredients');
};