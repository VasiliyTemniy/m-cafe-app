import type { MigrationContext } from '../types/Migrations.js';
import { DataTypes } from 'sequelize';
// import { PictureParentType } from '@m-cafe-app/shared-constants';

export const up = async ({ context: queryInterface }: MigrationContext) => {
  await queryInterface.createTable('pictures', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    src: {
      type: DataTypes.STRING,
      allowNull: false
    },
    // alt text loc is referenced from locs table
    parent_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: 'picture_unique'
    },
    parent_type: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      // validate: {
      //   isIn: [Object.values(PictureParentType)]
      // },
      unique: 'picture_unique'
    },
    order_number: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      unique: 'picture_unique'
    },
    total_downloads: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
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
  }, {
    uniqueKeys: {
      picture_unique: {
        fields: ['parent_id', 'parent_type']
      }
    }
  });
};

export const down = async ({ context: queryInterface }: MigrationContext) => {
  await queryInterface.dropTable('pictures');
};