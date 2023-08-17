import { DataTypes, QueryTypes } from 'sequelize';
import { MigrationContext } from '../types/MigrationContext.js';

export const up = async ({ context: queryInterface }: MigrationContext) => {
  await queryInterface.createTable('food_pictures', {
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
    main_picture: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  });

  const constraintCheck = await queryInterface.sequelize.query(
    "SELECT * FROM pg_constraint WHERE conname = 'food_pictures_pkey'",
    { type: QueryTypes.SELECT }
  );

  if (!constraintCheck[0]) {
    await queryInterface.addConstraint('food_pictures', {
      fields: [
        'food_id', 'picture_id'
      ],
      type: 'primary key',
      name: 'food_pictures_pkey'
    });
  }
};

export const down = async ({ context: queryInterface }: MigrationContext) => {
  await queryInterface.dropTable('food_pictures');
};