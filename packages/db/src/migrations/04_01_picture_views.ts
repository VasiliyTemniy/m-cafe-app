import type { MigrationContext } from '../types/Migrations.js';
import { DataTypes, QueryTypes } from 'sequelize';

export const up = async ({ context: queryInterface }: MigrationContext) => {
  await queryInterface.createTable('picture_views', {
    user_ip: {
      type: DataTypes.STRING,
      allowNull: false
    },
    picture_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'pictures', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    count: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  });

  const constraintCheck = await queryInterface.sequelize.query(
    "SELECT * FROM pg_constraint WHERE conname = 'picture_views_pkey'",
    { type: QueryTypes.SELECT }
  );

  if (!constraintCheck[0]) {
    await queryInterface.addConstraint('picture_views', {
      fields: [
        'user_ip', 'picture_id'
      ],
      type: 'primary key',
      name: 'picture_views_pkey'
    });
  }
};

export const down = async ({ context: queryInterface }: MigrationContext) => {
  await queryInterface.dropTable('picture_views');
};