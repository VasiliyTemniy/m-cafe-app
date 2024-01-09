import type { MigrationContext } from '../types/Migrations.js';
import { DataTypes } from 'sequelize';

export const up = async ({ context: queryInterface }: MigrationContext) => {
  await queryInterface.createTable('promo_event_codes', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    promo_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'promo_events', key: 'id' },
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
    code: {
      type: DataTypes.STRING,
      allowNull: false
    },
    discount: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0
    },
    price_cut_absolute: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    is_usage_limited: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    usage_total_limit: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    usage_per_user_limit: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    // used_count is held in event_promo_code_usages table, tracked by users
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
    }
  });
};

export const down = async ({ context: queryInterface }: MigrationContext) => {
  await queryInterface.dropTable('promo_event_codes');
};