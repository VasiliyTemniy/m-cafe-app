import type { MigrationContext } from '../types/Migrations.js';
import { DataTypes } from 'sequelize';

export const up = async ({ context: queryInterface }: MigrationContext) => {
  await queryInterface.createTable('dynamic_modules', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    module_type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    loc_string_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'loc_strings', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    page: {
      type: DataTypes.STRING,
      allowNull: false
    },
    placement: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    placement_type: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'afterMenuPicFirst'
    },    
    class_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    inline_css: {
      type: DataTypes.STRING,
      allowNull: true
    },
    picture_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'pictures', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    url: {
      type: DataTypes.STRING,
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
  await queryInterface.dropTable('dynamic_modules');
};