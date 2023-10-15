import { expect } from 'chai';
import 'mocha';
import { FixedLocRepoRedis, FixedLocRepoSequelizePG, FixedLocService } from '../models/FixedLoc';
import { dbHandler } from '@m-cafe-app/db';
import { redisFixedLocsClient } from '../config';


// No mocking, no unit testing for this package. Only integration tests ->
// If tests fail after dependency injection, change dependencies accordingly
// in these tests
const fixedLocService = new FixedLocService(
  new FixedLocRepoSequelizePG(),
  new FixedLocRepoRedis(redisFixedLocsClient)
);


describe('FixedLocService implementation tests', () => {

  before(async () => {
    await dbHandler.pingDb();
    await fixedLocService.connectInmem();
    await fixedLocService.pingInmem();
  });
  
  beforeEach(async () => {
    await fixedLocService.removeAll();
  });

  it('should initialize ui settings properly, store them in db and redis', async () => {

    // Path relative from backend-logic root
    await fixedLocService.initFixedLocs('../../services/backend/locales', 'jsonc');

    const fixedLocs = await fixedLocService.getAll();

    expect(fixedLocs.length).to.be.above(0);

    const inmemFixedLocs = await fixedLocService.getFromInmem();

    expect(inmemFixedLocs.length).to.be.above(0);

    expect(fixedLocs.length).to.equal(inmemFixedLocs.length);

  });

});