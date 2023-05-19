import { DataTypes } from 'sequelize'

export default {
  up: async ({ context: queryInterface }: any) => {
    await queryInterface.createTable('food_ingredients', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      food_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'foods', key: 'id' }
      },
      ingredient_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'ingredients', key: 'id' }
      },
      amount: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    })
  },
  down: async ({ context: queryInterface }: any) => {
    await queryInterface.dropTable('food_ingredients')
  },
}