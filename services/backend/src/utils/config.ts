import * as dotenv from 'dotenv';

export const isDockerized = (process.env.DOCKERIZED_DEV === 'true' || process.env.DOCKERIZED === 'true');

dotenv.config({
  override: isDockerized ? false : true
});


export const PORT = process.env.BACKEND_PORT as string;

export const ALLOWED_ORIGIN = (process.env.ALLOWED_ORIGIN as string).split(',');


export const FIXED_LOCS_PATH = process.env.FIXED_LOCS_PATH || 'locales';

export const FIXED_LOCS_EXT =
  process.env.FIXED_LOCS_EXT === 'json' ? 'json' :
  process.env.FIXED_LOCS_EXT === 'jsonc' ? 'jsonc' :
  'jsonc';