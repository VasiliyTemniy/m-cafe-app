import type { MigrationContext } from '../types/Migrations.js';
import { DataTypes } from 'sequelize';

// Example: one param for a request means path_postfix is null for this param
// api request record has path_prefix === '/api/v1/'
// => https://example.com/api/v1/<subject_key_value><path_postfix>
// => query https://example.com/api/v1/<subject_key_value>
//
// Example: two params; the first has path_postfix === '/deep_example/'
// api request record has path_prefix === '/api/v1/'
// => https://example.com/api/v1/<subject_key_value><path_postfix><subject_key_value_2>
// => query https://example.com/api/v1/<subject_key_value>/deep_example/<subject_key_value_2>

export const up = async ({ context: queryInterface }: MigrationContext) => {
  await queryInterface.createTable('api_request_params', {
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
    // subject key/field/parameter name to write as request param
    subject_key: {
      type: DataTypes.STRING,
      allowNull: false
    },
    // if path_postfix is null => this param is the last one; query string is applied after reaching this param
    path_postfix: {
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
  await queryInterface.dropTable('api_request_params');
};