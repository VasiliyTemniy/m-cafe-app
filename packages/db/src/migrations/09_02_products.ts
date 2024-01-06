import type { MigrationContext } from '../types/Migrations.js';
// import { MassEnum, PriceCutPermission, SizingEnum, VolumeEnum } from '@m-cafe-app/shared-constants';
import { PriceCutPermission } from '@m-cafe-app/shared-constants';
import { DataTypes } from 'sequelize';

export const up = async ({ context: queryInterface }: MigrationContext) => {
  await queryInterface.createTable('products', {
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
    // name and description locs are referenced from locs table
    product_type_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'product_types', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    },
    // Price is stored as real_price * CurrencyDecimalMultiplier;
    // BIGINT to prevent overflows;
    // Validate for less than 9,000,000,000,000,000 to prevent JS 'number' type overflow
    price: {
      type: DataTypes.BIGINT,
      allowNull: false,
      validate: {
        max: 9000000000000000
      }
    },
    currency_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'currencies', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    },
    price_cut_permissions: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      // validate: {
      //   isIn: [Object.values(PriceCutPermission)]
      // },
      defaultValue: PriceCutPermission.None
    },
    display_priority: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    is_featured: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    is_available: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    show_components: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    total_downloads: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    price_prefix: {
      type: DataTypes.STRING,
      allowNull: true
    },
    price_postfix: {
      type: DataTypes.STRING,
      allowNull: true
    },
    bonus_gain_rate: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    max_discount_cut_absolute: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    max_discount_cut_relative: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    max_bonus_cut_absolute: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    max_bonus_cut_relative: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    max_event_cut_absolute: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    max_event_cut_relative: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    max_total_cut_absolute: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    max_total_cut_relative: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    total_mass: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    mass_measure: {
      type: DataTypes.SMALLINT,
      allowNull: true,
      // validate: {
      //   isIn: [Object.values(MassEnum)]
      // }
    },
    total_volume: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    volume_measure: {
      type: DataTypes.SMALLINT,
      allowNull: true,
      // validate: {
      //   isIn: [Object.values(VolumeEnum)]
      // }
    },
    box_sizing_x: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    box_sizing_y: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    box_sizing_z: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    sizing_measure: {
      type: DataTypes.SMALLINT,
      allowNull: true,
      // validate: {
      //   isIn: [Object.values(SizingEnum)]
      // }
    },
    // product categories are handled in many-many junction table
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
  await queryInterface.dropTable('products');
};