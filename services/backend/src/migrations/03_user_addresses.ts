import { DataTypes, QueryTypes } from 'sequelize';
import { MigrationContext } from '../types/MigrationContext.js';

export const up = async ({ context: queryInterface }: MigrationContext) => {
  await queryInterface.createTable('user_addresses', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    address_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'addresses', key: 'id' },
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
    "SELECT * FROM pg_constraint WHERE conname = 'user_addresses_user_id_address_id_key'",
    { type: QueryTypes.SELECT }
  );

  if (!constraintCheck[0]) {
    await queryInterface.addConstraint('user_addresses', {
      fields: [
        'user_id', 'address_id'
      ],
      type: 'unique',
      name: 'user_addresses_user_id_address_id_key'
    });
  }
};

export const down = async ({ context: queryInterface }: MigrationContext) => {
  await queryInterface.dropTable('user_addresses');
};