import * as dotenv from 'dotenv';

export const isDockerized = (process.env.DOCKERIZED_DEV === 'true' || process.env.DOCKERIZED === 'true');

dotenv.config({
  override: isDockerized ? false : true
});


export const PORT = process.env.BACKEND_PORT as string;

export const ALLOWED_ORIGIN = (process.env.ALLOWED_ORIGIN as string).split(',');