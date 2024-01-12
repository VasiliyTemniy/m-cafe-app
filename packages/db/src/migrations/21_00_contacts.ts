import type { MigrationContext } from '../types/Migrations.js';
import {
  isContactParentType,
  isContactTarget,
  isContactType
} from '@m-market-app/shared-constants';
import { DataTypes } from 'sequelize';

export const up = async ({ context: queryInterface }: MigrationContext) => {
  await queryInterface.createTable('contacts', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    updated_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    type: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      validate: {
        isContactTypeValidator(value: unknown) {
          if (!isContactType(value)) {
            throw new Error(`Invalid contact type: ${value}`);
          }
        }
      },
    },
    target: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      validate: {
        isContactTargetValidator(value: unknown) {
          if (!isContactTarget(value)) {
            throw new Error(`Invalid contact target: ${value}`);
          }
        }
      },
    },
    parent_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    parent_type: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      validate: {
        isContactParentTypeValidator(value: unknown) {
          if (!isContactParentType(value)) {
            throw new Error(`Invalid contact parent type: ${value}`);
          }
        }
      },
    },
    value: {
      type: DataTypes.STRING,
      allowNull: false
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
  await queryInterface.dropTable('contacts');
};