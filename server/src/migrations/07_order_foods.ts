import { DataTypes } from 'sequelize'

export default {
  up: async ({ context: queryInterface }: any) => {
    await queryInterface.createTable('order_foods', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      order_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'orders', key: 'id' }
      },
      food_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'foods', key: 'id' }
      },
      amount: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      archive_price: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    })
  },
  down: async ({ context: queryInterface }: any) => {
    await queryInterface.dropTable('order_foods')
  },
}