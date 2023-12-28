import type { MigrationContext } from '../types/Migrations.js';
import { DataTypes, QueryTypes } from 'sequelize';
import { LocParentType, LocType } from '@m-cafe-app/shared-constants';

export const up = async ({ context: queryInterface }: MigrationContext) => {
  await queryInterface.createTable('loc_references', {
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
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [Object.values(LocType)]
      }
    },
    parent_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    parent_type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [Object.values(LocParentType)]
      }
    }
  });

  const constraintCheck = await queryInterface.sequelize.query(
    "SELECT * FROM pg_constraint WHERE conname = 'loc_references_pkey'",
    { type: QueryTypes.SELECT }
  );

  if (!constraintCheck[0]) {
    await queryInterface.addConstraint('loc_references', {
      fields: [
        'loc_id', 'language_id', 'loc_type', 'parent_id', 'parent_type'
      ],
      type: 'primary key',
      name: 'loc_references_pkey'
    });
  }
};

export const down = async ({ context: queryInterface }: MigrationContext) => {
  await queryInterface.dropTable('loc_references');
};