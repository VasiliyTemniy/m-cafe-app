import { expect } from 'chai';
import 'mocha';
import { getDBInfo } from './00_db_schemas_helper';
import { DATABASE_URL } from '../config';
import { diffString } from 'json-diff';
import { dbHandler } from '../db';


describe('Database migrations code is synchronized with models code', () => {

  before(async () => {
    await dbHandler.connect();
    await dbHandler.pingDb();
  });

  it('Schema comparison diff should be null', async () => {

    if (process.env.RUN_COMPARISON_TEST === 'false') return;

    await dbHandler.dbInstance?.drop({ cascade: true });
    await dbHandler.loadMigrations();
    await dbHandler.runMigrations();

    const dbInfo1 = await getDBInfo(DATABASE_URL);

    await dbHandler.dbInstance?.sync({ force: true });

    const dbInfo2 = await getDBInfo(DATABASE_URL);


    const deepEqual = (obj1: object, obj2: object): boolean => {
      const str1 = JSON.stringify(obj1);
      const str2 = JSON.stringify(obj2);

      return str1 === str2;
    };

    const state = deepEqual(dbInfo1, dbInfo2);

    if (!state) console.log(diffString(dbInfo1, dbInfo2));

    expect(state).to.equal(true);

  });

});

