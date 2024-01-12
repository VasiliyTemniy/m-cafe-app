import type { MigrationContext } from '../types/Migrations.js';
import { DataTypes } from 'sequelize';

// Example: expected response: { "id": "example_id", "token": "example_token" }
// That needs to be written in some DB table with columns: userId, authToken
// DB records for expected response:
// First: key === 'id'; subject_key === 'userId'
// Second: key === 'token'; subject_key === 'authToken'

export const up = async ({ context: queryInterface }: MigrationContext) => {
  await queryInterface.createTable('api_response_expectations', {
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
    subject_key: {
      type: DataTypes.STRING,
      allowNull: false
    },
    approved_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'users', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    },
  });
};

export const down = async ({ context: queryInterface }: MigrationContext) => {
  await queryInterface.dropTable('api_response_expectations');
};