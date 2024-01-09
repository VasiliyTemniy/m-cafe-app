import type { MigrationContext } from '../types/Migrations.js';
import { isOfferCodeGenerationMethod, isOfferGrantMethod, isOfferType } from '@m-cafe-app/shared-constants';
import { DataTypes } from 'sequelize';

export const up = async ({ context: queryInterface }: MigrationContext) => {
  await queryInterface.createTable('offer_policies', {
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
    // coverage is referenced from coverages table
    // name and description should not be localized - internal organization business logic
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    total_income_threshold: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    categorized_income_threshold: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    offer_type: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      validate: {
        isOfferTypeValidator(value: unknown) {
          if (!isOfferType(value)) {
            throw new Error(`Invalid offer type: ${value}`);
          }
        }
      },
    },
    offer_grant_method: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      validate: {
        isOfferGrantMethodValidator(value: unknown) {
          if (!isOfferGrantMethod(value)) {
            throw new Error(`Invalid offer grant method: ${value}`);
          }
        }
      },
    },
    offer_code_generation_method: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      validate: {
        isOfferCodeGenerationMethodValidator(value: unknown) {
          if (!isOfferCodeGenerationMethod(value)) {
            throw new Error(`Invalid offer code generation method: ${value}`);
          }
        }
      },
    },
    set_offer_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    set_offer_description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    set_discount: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    set_ms_unused_to_deactivate_discount: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    add_bonus_quantity: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    set_bonus_multiplier: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    set_bonus_to_currency_rate: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    set_bonus_expiracy_ms: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    set_delivery_free_threshold: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    set_offer_currency_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'currencies', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    set_offer_available_at_delay_ms: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    set_bonus_available_at_delay_ms: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    starts_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    ends_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
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
  await queryInterface.dropTable('offer_policies');
};