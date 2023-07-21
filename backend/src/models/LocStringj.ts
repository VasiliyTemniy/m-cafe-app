import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';

import { sequelize } from '../utils/db.js';

class LocString extends Model<InferAttributes<LocString>, InferCreationAttributes<LocString>> {
  declare id: CreationOptional<number>;
  declare ruString: string;
  declare enString: CreationOptional<string>;
  declare altString: CreationOptional<string>;
}

LocString.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  ruString: {
    type: DataTypes.STRING,
    allowNull: false
  },
  enString: {
    type: DataTypes.STRING,
    allowNull: true
  },
  altString: {
    type: DataTypes.STRING,
    allowNull: true
  },
}, {
  sequelize,
  underscored: true,
  timestamps: true,
  modelName: 'loc_string'
});

export default LocString;