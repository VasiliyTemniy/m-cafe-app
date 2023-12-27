import type { MigrationContext } from '../types/Migrations.js';
import { OfferGrantMethod, OfferType } from '@m-cafe-app/shared-constants';
import { DataTypes } from 'sequelize';

export const up = async ({ context: queryInterface }: MigrationContext) => {
  await queryInterface.createTable('offers', {
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
      onDelete: 'CASCADE',
      unique: 'unique_offer'
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      unique: 'unique_offer'
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [Object.values(OfferType)],
      },
      unique: 'unique_offer'
    },
    grant_method: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [Object.values(OfferGrantMethod)],
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    discount: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    bonus_to_currency_rate: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    bonus_gain_multiplier: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    delivery_free_threshold: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    currency_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'currencies', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    last_used_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    available_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    unused_to_deactivate_discount_ms: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    bonus_expiracy_ms: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    bonus_available_at_delay_ms: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    granted_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'users', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    },
    updated_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'users', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
    }
  }, {
    uniqueKeys: {
      unique_offers: {
        customIndex: true,
        fields: ['organization_id', 'user_id', 'type']
      }
    }
  });
};

export const down = async ({ context: queryInterface }: MigrationContext) => {
  await queryInterface.dropTable('offers');
};