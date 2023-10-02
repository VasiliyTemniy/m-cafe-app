import type { MigrationContext } from '../types/MigrationContext.js';
import { fixedLocsScopes } from '@m-cafe-app/shared-constants';
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
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [fixedLocsScopes]
      },
      unique: 'unique_fixed_loc'
    },
    loc_string_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'loc_strings', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    }
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