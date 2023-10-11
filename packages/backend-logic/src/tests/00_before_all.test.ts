import { dbHandler } from '@m-cafe-app/db';
import { expect } from 'chai';
import 'mocha';


describe('Initialize DB connection, models, run migrations', () => {

  it('should connect to DB', async () => {
    
    await dbHandler.connect();
    await dbHandler.pingDb();
    await dbHandler.loadMigrations();
    await dbHandler.runMigrations();

    expect(true).to.equal(true);

  });

});