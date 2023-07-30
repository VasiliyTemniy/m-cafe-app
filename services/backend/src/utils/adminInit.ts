import bcryptjs from 'bcryptjs';
import logger from './logger.js';
import { User } from '../models/index.js';
import config from './config.js';

export const initSuperAdmin = async () => {

  const existingUser = await User.findOne({
    where: {
      username: process.env.SUPERADMIN_USERNAME as string
    }
  });
  if (existingUser) {
    process.env.SUPERADMIN_USERNAME = '';
    process.env.SUPERADMIN_PASSWORD = '';
    return logger.info('Super admin user already exists');
  }

  const saltRounds = 10;
  const passwordHash = await bcryptjs.hash(process.env.SUPERADMIN_PASSWORD as string, saltRounds);

  const user = {
    username: process.env.SUPERADMIN_USERNAME as string,
    phonenumber: config.SUPERADMIN_PHONENUMBER,
    passwordHash,
    admin: true
  };

  await User.create(user);

  process.env.SUPERADMIN_USERNAME = '';
  process.env.SUPERADMIN_PASSWORD = '';

  return logger.info('Super admin user successfully created!');
};