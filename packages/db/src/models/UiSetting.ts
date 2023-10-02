import type { InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import type { PropertiesCreationOptional } from '@m-cafe-app/shared-constants';
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../db.js';
import { Op } from 'sequelize';
import { allowedThemes, componentGroups } from '@m-cafe-app/shared-constants';


export class UiSetting extends Model<InferAttributes<UiSetting>, InferCreationAttributes<UiSetting>> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare group: string;
  declare theme: string;
  declare value: string;
}


export type UiSettingData = Omit<InferAttributes<UiSetting>, PropertiesCreationOptional>
  & { id: number; };

  
UiSetting.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: 'unique_ui_setting'
  },
  group: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [componentGroups]
    },
    unique: 'unique_ui_setting'
  },
  theme: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [allowedThemes]
    },
    unique: 'unique_ui_setting'
  },
  value: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'ui_setting',
  indexes: [
    {
      unique: true,
      fields: ['name', 'group', 'theme']
    }
  ],
  defaultScope: {
    where: {
      value: {
        [Op.ne]: 'false'
      }
    }
  },
  scopes: {
    light: {
      where: {
        theme: {
          [Op.eq]: 'light'
        },
        value: {
          [Op.ne]: 'false'
        }
      }
    },
    dark: {
      where: {
        theme: {
          [Op.eq]: 'dark'
        },
        value: {
          [Op.ne]: 'false'
        }
      }
    },
    nonFalsy: {
      where: {
        value: {
          [Op.ne]: 'false'
        }
      }
    },
    all: {}
  }
});
  
export default UiSetting;