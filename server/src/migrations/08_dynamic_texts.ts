import { DataTypes } from 'sequelize'

export default {
  up: async ({ context: queryInterface }: any) => {
    await queryInterface.createTable('dynamic_texts', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      ru_text: {
        type: DataTypes.STRING,
        allowNull: true
      },
      en_text: {
        type: DataTypes.STRING,
        allowNull: true
      },
      ar_text: {
        type: DataTypes.STRING,
        allowNull: true
      },
      page: {
        type: DataTypes.STRING,
        allowNull: false
      },
      placement: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      inline_css: {
        type: DataTypes.STRING,
        allowNull: true
      },
      image_src: {
        type: DataTypes.STRING,
        allowNull: true
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
    await queryInterface.dropTable('dynamic_texts')
  },
}