/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// umzug did not work with .ts import export "type": "module" system and so on
// workaround with custom file imports

import type { MigrationContext } from './types/MigrationContext.js';
import { glob } from 'glob';
import { logger } from '@m-cafe-app/utils';
import path from 'path';

type MigrationFn = ({ context }: MigrationContext) => Promise<void>;

export const loadMigrations = async () => {

  let migrations: { name: string; up: MigrationFn; down: MigrationFn; }[] = [];

  try {

    const prodMigrationsGlobPath = 'packages/db/build/migrations/';
    const devMigrationsRelativePath = '../../packages/db/build/migrations/';
    const testMigrationsSelfPath = 'src/migrations/';

    /*
    / in production, all files are .js and served from ./build folder
    */
    const res = process.env.NODE_ENV === 'production'
      ? await glob(`${prodMigrationsGlobPath}*.js`)
      : (process.env.NODE_ENV === 'test' && process.env.TEST_MODE === 'self')
        ? await glob(`${testMigrationsSelfPath}*.ts`)
        : await glob(`${devMigrationsRelativePath}*.js`);

    const migrationsPromise = res.map(async (file) => {

      // replace file path from win32 to linux
      const filePath = process.platform === 'win32'
        ? file.split(path.sep).join(path.posix.sep)
        : file;

      /*
      / replace path is different for windows and in production src -> build
      */
      const replacePath = process.env.NODE_ENV === 'production'
        ? prodMigrationsGlobPath
        : process.env.TEST_MODE === 'self'
          ? testMigrationsSelfPath
          : devMigrationsRelativePath;

      const { up, down } = await import(filePath.replace(replacePath, './migrations/'));
      return {
        name: filePath.replace(replacePath, '').replace('.ts', '').replace('.js', ''),
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