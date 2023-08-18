import { DataTypes } from 'sequelize';

import { sequelize } from '../utils/db.js';
import { UiSetting } from '@m-cafe-app/db-models';

UiSetting.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  value: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'ui_setting'
});

export default UiSetting;