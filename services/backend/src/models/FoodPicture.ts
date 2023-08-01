import { DataTypes } from '@m-cafe-app/shared-backend-deps/sequelize.js';

import { sequelize } from '../utils/db.js';
import { FoodPicture } from '@m-cafe-app/db-models';

FoodPicture.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
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
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false
  },
}, {
  sequelize,
  underscored: true,
  timestamps: true,
  modelName: 'food_pictures'
});

export default FoodPicture;