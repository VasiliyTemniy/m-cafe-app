import type { MigrationContext } from '../types/Migrations.js';
import { isFixedLocScope } from '@m-cafe-app/shared-constants';
import { DataTypes } from 'sequelize';

export const up = async ({ context: queryInterface }: MigrationContext) => {
  await queryInterface.createTable('fixed_locs', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: 'unique_fixed_loc'
    },
    namespace: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: 'unique_fixed_loc'
    },
    scope: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      validate: {
        isFixedLocScopeValidator(value: unknown) {
          if (!isFixedLocScope(value)) {
            throw new Error(`Invalid fixed loc scope: ${value}`);
          }
        }
      },
      unique: 'unique_fixed_loc'
    },
    // actual locs are referenced from locs table
  }, {
    uniqueKeys: {
      unique_fixed_loc: {
        customIndex: true,
        fields: ['name', 'namespace', 'scope']
      }
    }
  });
};

export const down = async ({ context: queryInterface }: MigrationContext) => {
  await queryInterface.dropTable('fixed_locs');
};