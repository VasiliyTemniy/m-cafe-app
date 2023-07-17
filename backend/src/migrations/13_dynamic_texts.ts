import { DataTypes } from 'sequelize';
import { MigrationContext } from '../types/umzugContext.js';

export const up = async ({ context: queryInterface }: MigrationContext) => {
  await queryInterface.createTable('dynamic_texts', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    ru_text: {
      type: DataTypes.STRING,
      allowNull: true
    },
    en_text: {
      type: DataTypes.STRING,
      allowNull: true
    },
    ar_text: {
      type: DataTypes.STRING,
      allowNull: true
    },
    page: {
      type: DataTypes.STRING,
      allowNull: false
    },
    placement: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    inline_css: {
      type: DataTypes.STRING,
      allowNull: true
    },
    image_src: {
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
  await queryInterface.dropTable('dynamic_texts');
};