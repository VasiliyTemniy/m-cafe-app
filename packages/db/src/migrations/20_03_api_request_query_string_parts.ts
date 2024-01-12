import type { MigrationContext } from '../types/Migrations.js';
import { DataTypes } from 'sequelize';

// Example: one query string part for a request
// api request record has path_prefix === '/api/v1/'
// api request has one param with path_postfix === null
// separator from api_request_query_string_parts === '?'
// key === 'key'
// => https://example.com/api/v1/<subject_param_key_value><path_postfix><separator><key>=<subject_key_value>
// => query https://example.com/api/v1/<subject_param_key_value>?key=<subject_key_value>
//
// Example: two query string parts for a request
// api request record has path_prefix === '/api/v1/'
// api request has one param with path_postfix === null
// Two query string parts:
// First: separator1 === '?'; key1 === 'key1'
// Second: separator2 === '&'; key2 === 'key2'
// => https://example.com/api/v1/<subject_param_key_value><path_postfix><separator1><key1>=<subject_key1_value><separator2><key2>=<subject_key2_value>
// => query https://example.com/api/v1/<subject_param_key_value>?key1=<subject_key1_value>&key2=<subject_key2_value>

export const up = async ({ context: queryInterface }: MigrationContext) => {
  await queryInterface.createTable('api_request_query_string_parts', {
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
    order_number: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    // query string part key name
    key: {
      type: DataTypes.STRING,
      allowNull: false
    },
    // query string part value; taken from given subject with the following key
    subject_key: {
      type: DataTypes.STRING,
      allowNull: false
    },
    // applied before query string part, not after
    separator: {
      type: DataTypes.STRING,
      allowNull: true
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
  await queryInterface.dropTable('api_request_query_string_parts');
};