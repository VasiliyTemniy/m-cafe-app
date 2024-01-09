import type { MigrationContext } from '../types/Migrations.js';
import { isApiRequestTokenPlacement } from '@m-cafe-app/shared-constants';
import { DataTypes } from 'sequelize';

export const up = async ({ context: queryInterface }: MigrationContext) => {
  // The only one api request table that does not need app admin approval
  await queryInterface.createTable('api_request_tokens', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    api_request_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'api_requests', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    key: {
      type: DataTypes.STRING,
      allowNull: false
    },
    value: {
      type: DataTypes.STRING,
      allowNull: false
    },
    placement: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      validate: {
        isApiRequestTokenPlacementValidator(value: unknown) {
          if (!isApiRequestTokenPlacement(value)) {
            throw new Error(`Invalid api request token placement: ${value}`);
          }
        }
      },
    },
    // prefix example: 'Bearer ' with essential space in the end if there is one
    prefix: {
      type: DataTypes.STRING,
      allowNull: true
    }
  });
};

export const down = async ({ context: queryInterface }: MigrationContext) => {
  await queryInterface.dropTable('api_request_tokens');
};