import * as dotenv from 'dotenv';

export const isDockerized = (process.env.DOCKERIZED_DEV === 'true' || process.env.DOCKERIZED === 'true');

dotenv.config({
  override: isDockerized ? false : true
});

const SUPERADMIN_PHONENUMBER = process.env.SUPERADMIN_PHONENUMBER as string;

export default {
  SUPERADMIN_PHONENUMBER
};