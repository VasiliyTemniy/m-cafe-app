/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// umzug did not work with .ts import export "type": "module" system and so on
// workaround with custom file imports

import { glob } from 'glob';
import { MigrationContext } from '../types/MigrationContext.js';

type MigrationFn = ({ context }: MigrationContext) => Promise<void>;

export const loadMigrations = async () => {

  let migrations: { name: string; up: MigrationFn; down: MigrationFn; }[] = [];

  try {

    /*
    / in production, all files are .js and served from ./build folder
    */
    const res = process.env.NODE_ENV === 'production'
      ? await glob('build/migrations/*.js', { ignore: 'build/migrations/index.js' })
      : await glob('src/migrations/*.ts', { ignore: 'src/migrations/index.ts' });

    const migrationsPromise = res.map(async (file) => {

      /*
      / replace path is different for windows and in production src -> build
      */
      const replacePath = process.platform === 'win32' ? 'src\\migrations\\' :
        process.env.NODE_ENV === 'production' ? 'build/migrations/' : 'src/migrations/';

      const { up, down } = await import(file.replace(replacePath, './'));
      return {
        name: file.replace(replacePath, '').replace('.ts', '').replace('.js', ''),
        up,
        down
      };
    });

    migrations = await Promise.all(migrationsPromise);

  } catch (err) {
    // handle `err`
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