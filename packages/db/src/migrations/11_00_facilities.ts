import type { MigrationContext } from '../types/Migrations.js';
import { isFacilityType } from '@m-cafe-app/shared-constants';
import { DataTypes } from 'sequelize';

export const up = async ({ context: queryInterface }: MigrationContext) => {
  await queryInterface.createTable('facilities', {
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
    address_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'addresses', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    // name and description locs are referenced from locs table
    // contacts are referenced from contacts table
    facility_type: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      validate: {
        isFacilityTypeValidator(value: unknown) {
          if (!isFacilityType(value)) {
            throw new Error(`Invalid facility type: ${value}`);
          }
        }
      },
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
  await queryInterface.dropTable('facilities');
};