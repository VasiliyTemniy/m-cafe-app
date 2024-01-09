import type { MigrationContext } from '../types/Migrations.js';
import { DataTypes, QueryTypes } from 'sequelize';
import { isLocType, isLocParentType } from '@m-cafe-app/shared-constants';

export const up = async ({ context: queryInterface }: MigrationContext) => {
  await queryInterface.createTable('locs', {
    loc_id: {
      type: DataTypes.INTEGER,
      references: { model: 'locs', key: 'id' },
      allowNull: false,
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    language_id: {
      type: DataTypes.INTEGER,
      references: { model: 'languages', key: 'id' },
      allowNull: false,
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      unique: 'unique_loc'
    },
    loc_type: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      validate: {
        isLocTypeValidator(value: unknown) {
          if (!isLocType(value)) {
            throw new Error(`Invalid loc type: ${value}`);
          }
        }
      }
    },
    parent_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    parent_type: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      validate: {
        isLocParentTypeValidator(value: unknown) {
          if (!isLocParentType(value)) {
            throw new Error(`Invalid loc parent type: ${value}`);
          }
        }
      }
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

  const constraintCheck = await queryInterface.sequelize.query(
    "SELECT * FROM pg_constraint WHERE conname = 'locs_pkey'",
    { type: QueryTypes.SELECT }
  );

  if (!constraintCheck[0]) {
    await queryInterface.addConstraint('locs', {
      fields: [
        'loc_id', 'language_id', 'loc_type', 'parent_id', 'parent_type'
      ],
      type: 'primary key',
      name: 'locs_pkey'
    });
  }
};

export const down = async ({ context: queryInterface }: MigrationContext) => {
  await queryInterface.dropTable('locs');
};