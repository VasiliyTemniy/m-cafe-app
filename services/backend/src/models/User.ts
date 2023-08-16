import { DataTypes } from 'sequelize';

import { sequelize } from '../utils/db.js';
import {
  emailRegExp,
  maxEmailLen,
  maxNameLen,
  maxPhonenumberLen,
  maxUsernameLen,
  minEmailLen,
  minNameLen,
  minPhonenumberLen,
  minUsernameLen,
  nameRegExp,
  phonenumberRegExp,
  possibleUserRights,
  usernameRegExp
} from '../utils/constants.js';
import { User } from '@m-cafe-app/db-models';
import { Op } from 'sequelize';


User.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: true,
    validate: {
      is: [usernameRegExp, 'i'],
      len: [minUsernameLen, maxUsernameLen]
    }
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      is: [nameRegExp, 'i'],
      len: [minNameLen, maxNameLen]
    }
  },
  passwordHash: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phonenumber: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      is: [phonenumberRegExp, 'i'],
      len: [minPhonenumberLen, maxPhonenumberLen]
    }
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: true,
    validate: {
      is: [emailRegExp, 'i'],
      len: [minEmailLen, maxEmailLen]
    }
  },
  birthdate: {
    type: DataTypes.DATE,
    allowNull: true,
    validate: {
      isDate: true
    }
  },
  rights: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'user',
    validate: {
      isIn: [[...possibleUserRights]]
    }
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false
  },
  deletedAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  sequelize,
  underscored: true,
  timestamps: true,
  paranoid: true,
  modelName: 'user',
  defaultScope: {
    where: {
      rights: {
        [Op.ne]: 'disabled'
      }
    }
  },
  scopes: {
    user: {
      where: {
        rights: {
          [Op.eq]: 'user'
        }
      }
    },
    admin: {
      where: {
        rights: {
          [Op.eq]: 'admin'
        }
      }
    },
    manager: {
      where: {
        rights: {
          [Op.eq]: 'manager'
        }
      }
    },
    disabled: {
      where: {
        rights: {
          [Op.eq]: 'disabled'
        }
      }
    },
    all: {}
  }
});

export default User;