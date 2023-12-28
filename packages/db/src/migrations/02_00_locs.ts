import type { MigrationContext } from '../types/Migrations.js';
import { DataTypes } from 'sequelize';

export const up = async ({ context: queryInterface }: MigrationContext) => {
  await queryInterface.createTable('locs', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    language_id: {
      type: DataTypes.INTEGER,
      references: { model: 'languages', key: 'id' },
      allowNull: false,
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      unique: 'unique_loc'
    },
    text: {
      type: DataTypes.STRING(5000),
      allowNull: false,
      unique: 'unique_loc'
    }
  }, {
    uniqueKeys: {
      unique_loc: {
        customIndex: true,
        fields: ['language_id', 'text']
      }
    }
  });
};

export const down = async ({ context: queryInterface }: MigrationContext) => {
  await queryInterface.dropTable('locs');
};