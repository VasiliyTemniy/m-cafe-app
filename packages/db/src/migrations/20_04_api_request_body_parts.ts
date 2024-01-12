import type { MigrationContext } from '../types/Migrations.js';
import { DataTypes } from 'sequelize';

// Given some User record { username: 'example_username', password: 'example_password' }
//
// Example: Desired body is { "username": "<username>", "password": "<password>" }
// Two body parts:
// First: key === 'username'; subject_key === 'username'
// Second: key === 'password'; subject_key === 'password'
// Resulting body is { "username": "example_username", "password": "example_password" }
//
// Given some User record { lookupHash: 'example_lookupHash', phonenumber: 'example_phonenumber' }
//
// Example: Desired body is { "username": "<username>", "password": "<password>" }
// But our DB does not hold 'username' fields, for example.
// Use some another unique User key instead, for example - 'lookupHash'
// Our DB does not hold 'password', either.
// Use another unique User key instead, for example - 'phonenumber'
// Two body parts:
// First: key === 'username'; subject_key === 'lookupHash'
// Second: key === 'password'; subject_key === 'phonenumber'
// Resulting body is { "username": "example_lookupHash", "password": "example_phonenumber" }

export const up = async ({ context: queryInterface }: MigrationContext) => {
  await queryInterface.createTable('api_request_body_parts', {
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
  await queryInterface.dropTable('api_request_body_parts');
};