/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// umzug did not work with .ts import export "type": "module" system and so on
// workaround with custom file imports

import type { MigrationContext } from './types/MigrationContext.js';
import { glob } from 'glob';
import logger from './logger.js';

type MigrationFn = ({ context }: MigrationContext) => Promise<void>;

export const loadMigrations = async () => {

  let migrations: { name: string; up: MigrationFn; down: MigrationFn; }[] = [];

  try {

    const prodMigrationsGlobPath = 'packages/db/build/migrations/';
    const devMigrationsRelativePath = '../../packages/db/build/migrations/';
    const devMigrationsRelativePathWin32 = '..\\..\\packages\\db\\build\\migrations\\';

    /*
    / in production, all files are .js and served from ./build folder
    */
    const res = process.env.NODE_ENV === 'production'
      ? await glob(`${prodMigrationsGlobPath}*.js`)
      : await glob(`${devMigrationsRelativePath}*.js`);

    const migrationsPromise = res.map(async (file) => {

      /*
      / replace path is different for windows and in production src -> build
      */
      const replacePath = process.platform === 'win32' ? devMigrationsRelativePathWin32 :
        process.env.NODE_ENV === 'production' ? prodMigrationsGlobPath : devMigrationsRelativePath;

      const { up, down } = await import(file.replace(replacePath, './migrations/'));
      return {
        name: file.replace(replacePath, '').replace('.ts', '').replace('.js', ''),
        up,
        down
      };
    });

    migrations = await Promise.all(migrationsPromise);

  } catch (error) {
    logger.shout(error);
    throw new Error('Migrations failed to load!');
  }

  migrations.sort((migA, migB) => {
    if (migA.name < migB.name) {
      return -1;
    }
    if (migA.name > migB.name) {
      return 1;
    }
    return 0;
  });

  return migrations;
};