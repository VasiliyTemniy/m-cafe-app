import type { MigrationContext } from '../types/Migrations.js';
import { isTagParentType } from '@m-cafe-app/shared-constants';
import { DataTypes, QueryTypes } from 'sequelize';

export const up = async ({ context: queryInterface }: MigrationContext) => {
  await queryInterface.createTable('tag_relations', {
    tag_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'tags', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    parent_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    parent_type: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      validate: {
        isTagParentTypeValidator(value: unknown) {
          if (!isTagParentType(value)) {
            throw new Error(`Invalid tag parent type: ${value}`);
          }
        }
      },
    },
  });

  const constraintCheck = await queryInterface.sequelize.query(
    "SELECT * FROM pg_constraint WHERE conname = 'tag_relations_pkey'",
    { type: QueryTypes.SELECT }
  );

  if (!constraintCheck[0]) {
    await queryInterface.addConstraint('tag_relations', {
      fields: [
        'tag_id', 'parent_id', 'parent_type'
      ],
      type: 'primary key',
      name: 'tag_relations_pkey'
    });
  }
};

export const down = async ({ context: queryInterface }: MigrationContext) => {
  await queryInterface.dropTable('tag_relations');
};