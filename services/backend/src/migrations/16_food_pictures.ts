import { DataTypes, QueryTypes } from 'sequelize';
import { MigrationContext } from '../types/MigrationContext.js';

export const up = async ({ context: queryInterface }: MigrationContext) => {
  await queryInterface.createTable('food_pictures', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    food_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'foods', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    picture_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'pictures', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
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
    "SELECT * FROM pg_constraint WHERE conname = 'food_pictures_food_id_picture_id_key'",
    { type: QueryTypes.SELECT }
  );

  if (!constraintCheck[0]) {
    await queryInterface.addConstraint('food_pictures', {
      fields: [
        'food_id', 'picture_id'
      ],
      type: 'unique',
      name: 'food_pictures_food_id_picture_id_key'
    });
  }
};

export const down = async ({ context: queryInterface }: MigrationContext) => {
  await queryInterface.dropTable('food_pictures');
};