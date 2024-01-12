import type { MigrationContext } from '../types/Migrations.js';
import { isCommentParentType } from '@m-market-app/shared-constants';
import { DataTypes } from 'sequelize';

export const up = async ({ context: queryInterface }: MigrationContext) => {
  await queryInterface.createTable('comments', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    text: {
      type: DataTypes.STRING(5000),
      allowNull: false
    },
    parent_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    parent_type: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      validate: {
        isCommentParentTypeValidator(value: unknown) {
          if (!isCommentParentType(value)) {
            throw new Error(`Invalid comment parent type: ${value}`);
          }
        }
      },
    },
    order_number: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    parent_comment_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'comments', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'users', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    archive_user_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    blocked_reason: {
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
  });
};

export const down = async ({ context: queryInterface }: MigrationContext) => {
  await queryInterface.dropTable('comments');
};