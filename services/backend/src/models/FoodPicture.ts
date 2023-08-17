import { DataTypes } from 'sequelize';

import { sequelize } from '../utils/db.js';
import { FoodPicture } from '@m-cafe-app/db-models';

FoodPicture.init({
  foodId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'foods', key: 'id' },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  pictureId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'pictures', key: 'id' },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  mainPicture: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'food_picture'
});

export default FoodPicture;