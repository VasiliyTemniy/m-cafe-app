import { User } from './User.js';
import { Address } from './Address.js';
import { Op } from 'sequelize';



export const initUserScopes = async () => {

  const includeAddresses = {
    model: Address,
    as: 'addresses',
    through: {
      attributes: []
    },
    attributes: {
      exclude: ['createdAt', 'updatedAt']
    }
  };

  return new Promise<void>((resolve, reject) => {
    try {

      User.addScope('customer', {
        where: {
          rights: {
            [Op.eq]: 'customer'
          }
        },
        attributes: {
          exclude: ['passwordHash', 'createdAt', 'updatedAt', 'deletedAt']
        }
      });

      User.addScope('admin', {
        where: {
          rights: {
            [Op.eq]: 'admin'
          }
        },
        attributes: {
          exclude: ['passwordHash', 'createdAt', 'updatedAt', 'deletedAt']
        }
      });

      User.addScope('manager', {
        where: {
          rights: {
            [Op.eq]: 'manager'
          }
        },
        attributes: {
          exclude: ['passwordHash', 'createdAt', 'updatedAt', 'deletedAt']
        }
      });

      User.addScope('disabled', {
        where: {
          rights: {
            [Op.eq]: 'disabled'
          }
        },
        attributes: {
          exclude: ['passwordHash', 'createdAt', 'updatedAt', 'deletedAt']
        }
      });

      User.addScope('deleted', {
        where: {
          deletedAt: {
            [Op.not]: {
              [Op.is]: undefined
            }
          }
        },
        attributes: {
          exclude: ['passwordHash']
        },
        paranoid: false
      });

      User.addScope('all', {
        attributes: {
          exclude: ['passwordHash', 'createdAt', 'updatedAt', 'deletedAt']
        },
        paranoid: false
      });

      User.addScope('allWithAddresses', {
        include: [includeAddresses],
        attributes: {
          exclude: ['passwordHash', 'createdAt', 'updatedAt', 'deletedAt']
        },
        paranoid: false
      });

      User.addScope('allWithTimestamps', {
        attributes: {
          exclude: ['passwordHash']
        },
        paranoid: false
      });

      User.addScope('passwordHashRights', {
        attributes: {
          exclude: ['name', 'username', 'phonenumber', 'email', 'birthdate', 'createdAt', 'updatedAt', 'deletedAt']
        },
        paranoid: false
      });

      resolve();
    } catch (err) {
      reject(err);
    }
  });
};