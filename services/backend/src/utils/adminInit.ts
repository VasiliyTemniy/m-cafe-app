import bcryptjs from 'bcryptjs';
import logger from './logger.js';
import { User } from '../models/index.js';

export const initSuperAdmin = async () => {

  const existingUser = await User.findOne({
    where: {
      username: process.env.SUPERADMIN_USERNAME as string
    }
  });
  if (existingUser) {
    return logger.info('Super admin user already exists');
  }

  const saltRounds = 10;
  const passwordHash = await bcryptjs.hash(process.env.SUPERADMIN_PASSWORD as string, saltRounds);

  const user = {
    username: process.env.SUPERADMIN_USERNAME as string,
    phonenumber: process.env.SUPERADMIN_PHONENUMBER as string,
    passwordHash,
    admin: true
  };

  await User.create(user);

  process.env.SUPERADMIN_USERNAME = '';
  process.env.SUPERADMIN_PASSWORD = '';

  return logger.info('Super admin user successfully created!');
};