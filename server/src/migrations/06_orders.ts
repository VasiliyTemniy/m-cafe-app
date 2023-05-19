import { DataTypes } from 'sequelize'

export default {
  up: async ({ context: queryInterface }: any) => {
    await queryInterface.createTable('orders', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' }
      },
      address_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'addresses', key: 'id' }
      },
      deliver_at: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          isDate: true
        }
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false
      }
    })
  },
  down: async ({ context: queryInterface }: any) => {
    await queryInterface.dropTable('orders')
  },
}