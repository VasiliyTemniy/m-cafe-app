import bcryptjs from 'bcryptjs';
import logger from './logger.js';
import { User } from '../models/index.js';
import config from './config.js';

export const initSuperAdmin = async () => {

  // Check for existing superadmin
  const existingUser = await User.findOne({
    where: {
      username: process.env.SUPERADMIN_USERNAME as string,
      phonenumber: config.SUPERADMIN_PHONENUMBER
    }
  });
  if (existingUser) {

    // Some paranoid checks
    if (
      !existingUser.admin
      ||
      existingUser.disabled
      ||
      existingUser.phonenumber !== config.SUPERADMIN_PHONENUMBER
    ) {
      existingUser.username = process.env.SUPERADMIN_USERNAME as string;
      existingUser.phonenumber = config.SUPERADMIN_PHONENUMBER;
      const saltRounds = 10;
      const passwordHash = await bcryptjs.hash(process.env.SUPERADMIN_PASSWORD as string, saltRounds);
      existingUser.passwordHash = passwordHash;
      existingUser.admin = true;
      existingUser.disabled = false;
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
    admin: true
  };

  await User.create(user);

  process.env.SUPERADMIN_USERNAME = '';
  process.env.SUPERADMIN_PASSWORD = '';

  return logger.info('Super admin user successfully created!');
};