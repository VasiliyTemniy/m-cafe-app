import { DataTypes } from 'sequelize'

export default {
  up: async ({ context: queryInterface }: any) => {
    await queryInterface.createTable('addresses', {
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
      region: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          is: /^[А-Яа-я0-9]+(?:[ _-][А-Яа-я0-9]+)*$/i,
          len: [3, 50]
        }
      },
      district: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          is: /^[А-Яа-я0-9]+(?:[ _-][А-Яа-я0-9]+)*$/i,
          len: [3, 50]
        }
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          is: /^[А-Яа-я0-9]+(?:[ _-][А-Яа-я0-9]+)*$/i,
          len: [3, 50]
        }
      },
      street: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          is: /^[А-Яа-я0-9]+(?:[ _-][А-Яа-я0-9]+)*$/i,
          len: [3, 50]
        }
      },
      house: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          is: /^[А-Яа-я0-9]+(?:[ _\/\\-][А-Яа-я0-9]+)*$/i,
          len: [3, 20]
        }
      },
      entrance: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          is: /^[А-Яа-я0-9]+(?:[ _\/\\-][А-Яа-я0-9]+)*$/i,
          len: [3, 20]
        }
      },
      floor: {
        type: DataTypes.NUMBER,
        allowNull: true,
        validate: {
          isNumeric: true,
          len: [1, 3]
        }
      },
      flat: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          is: /^[А-Яа-я0-9]+(?:[ _\/\\-][А-Яа-я0-9]+)*$/i,
          len: [3, 20]
        }
      },
      entrance_key: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          is: /^[А-Яа-я0-9]+(?:[ _\/\\#*-А-Яа-я0-9]+)*$/i,
          len: [3, 20]
        }
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
    await queryInterface.dropTable('addresses')
  },
}