import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey } from 'sequelize'
import User from './user.js'

import { sequelize } from '../utils/db.js'

class Address extends Model<InferAttributes<Address>, InferCreationAttributes<Address>> {
  declare id: CreationOptional<number>;
  declare userId: ForeignKey<User['id']>;
  declare region: CreationOptional<string>;
  declare district: CreationOptional<string>;
  declare city: string;
  declare street: string;
  declare house: string;
  declare entrance: string;
  declare floor: Number;
  declare flat: string;
  declare entranceKey: string;
}

Address.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
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
  entranceKey: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      is: /^[А-Яа-я0-9]+(?:[ _\/\\#*-А-Яа-я0-9]+)*$/i,
      len: [3, 20]
    }
  },
}, {
  sequelize,
  underscored: true,
  timestamps: true,
  modelName: 'address'
})

export default Address