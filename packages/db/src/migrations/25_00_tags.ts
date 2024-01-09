import type { MigrationContext } from '../types/Migrations.js';
import { isTagParentType } from '@m-cafe-app/shared-constants';
import { DataTypes } from 'sequelize';

export const up = async ({ context: queryInterface }: MigrationContext) => {
  await queryInterface.createTable('tags', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    parent_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    parent_type: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      validate: {
        isTagParentTypeValidator(value: unknown) {
          if (!isTagParentType(value)) {
            throw new Error(`Invalid tag parent type: ${value}`);
          }
        }
      },
    },
    // name locs are referenced from locs table
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });
};

export const down = async ({ context: queryInterface }: MigrationContext) => {
  await queryInterface.dropTable('tags');
};