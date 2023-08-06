import bcryptjs from 'bcryptjs';
import logger from './logger.js';
import { User } from '../models/index.js';
import config from './config.js';

export const initSuperAdmin = async () => {

  // Check for existing superadmin
  const existingUser = await User.findOne({
    where: {
      phonenumber: config.SUPERADMIN_PHONENUMBER
    }
  });
  if (existingUser) {

    // Some paranoid checks
    if (
      existingUser.rights !== 'admin'
      ||
      existingUser.phonenumber !== config.SUPERADMIN_PHONENUMBER
    ) {
      existingUser.username = process.env.SUPERADMIN_USERNAME as string;
      existingUser.phonenumber = config.SUPERADMIN_PHONENUMBER;
      const saltRounds = 10;
      const passwordHash = await bcryptjs.hash(process.env.SUPERADMIN_PASSWORD as string, saltRounds);
      existingUser.passwordHash = passwordHash;
      existingUser.rights = 'admin';
      await existingUser.save();
    }

    process.env.SUPERADMIN_USERNAME = '';
    process.env.SUPERADMIN_PASSWORD = '';
    return logger.info('Super admin user already exists');
  }

  // New superadmin creation
  const saltRounds = 10;
  const passwordHash = await bcryptjs.hash(process.env.SUPERADMIN_PASSWORD as string, saltRounds);

  const user = {
    username: process.env.SUPERADMIN_USERNAME as string,
    phonenumber: config.SUPERADMIN_PHONENUMBER,
    passwordHash,
    rights: 'admin'
  };

  await User.create(user);

  process.env.SUPERADMIN_USERNAME = '';
  process.env.SUPERADMIN_PASSWORD = '';

  return logger.info('Super admin user successfully created!');
};