import { expect } from 'chai';
import 'mocha';
import { FixedLocRepoRedis, FixedLocRepoSequelizePG, FixedLocService } from '../models/FixedLoc';
import { dbHandler } from '@m-cafe-app/db';
import { redisFixedLocsClient } from '../config';
import { LocStringRepoSequelizePG } from '../models/LocString';
import { TransactionHandlerSequelizePG } from '../utils';


// No mocking, no unit testing for this package. Only integration tests ->
// If tests fail after dependency injection, change dependencies accordingly
// in these tests

const fixedLocsPath = '../../services/backend/' + process.env.FIXED_LOCS_PATH || '../../services/backend/locales';
const envFixedLocsExt = process.env.FIXED_LOCS_EXT;
const fixedLocsExt =
  envFixedLocsExt === 'json' ? 'json' :
  envFixedLocsExt === 'jsonc' ? 'jsonc' :
  'jsonc';


describe('FixedLocService implementation tests', () => {

  let fixedLocService: FixedLocService;

  before(async () => {
    await dbHandler.pingDb();

    fixedLocService = new FixedLocService(
      new FixedLocRepoSequelizePG(),
      new LocStringRepoSequelizePG(),
      new TransactionHandlerSequelizePG(
        dbHandler
      ),
      new FixedLocRepoRedis(redisFixedLocsClient)
    );

    await fixedLocService.connectInmem();
    await fixedLocService.pingInmem();
  });
  
  beforeEach(async () => {
    await fixedLocService.removeAll();
  });

  it('should initialize fixed locs properly, store them in db and redis', async () => {

    // Path relative from backend-logic root
    await fixedLocService.initFixedLocs(fixedLocsPath, fixedLocsExt);

    const fixedLocs = await fixedLocService.getAll();

    expect(fixedLocs.length).to.be.above(0);

    const inmemFixedLocs = await fixedLocService.getFromInmem();

    expect(inmemFixedLocs.length).to.be.above(0);

    expect(fixedLocs.length).to.equal(inmemFixedLocs.length);

  });

  it('should update fixed locs in both redis and db', async () => {

    await fixedLocService.initFixedLocs(fixedLocsPath, fixedLocsExt);

    const fixedLocs = await fixedLocService.getAll();

    const randomFixedLoc = fixedLocs[Math.floor(Math.random() * (fixedLocs.length - 1))];

    await fixedLocService.update({
      id: randomFixedLoc.id,
      name: randomFixedLoc.name,
      namespace: randomFixedLoc.namespace,
      scope: randomFixedLoc.scope,
      locString: {
        id: randomFixedLoc.locString.id,
        mainStr: 'testupd1',
        secStr: 'testupd2',
        altStr: 'testupd3'
      }
    });

    const updatedFixedLocs = await fixedLocService.getAll();

    const updatedInmemFixedLocs = await fixedLocService.getFromInmem();

    expect(updatedFixedLocs.length).to.equal(fixedLocs.length);
    expect(updatedInmemFixedLocs.length).to.equal(fixedLocs.length);

    const foundFixedLoc = updatedFixedLocs.find(fixedLoc => fixedLoc.id === randomFixedLoc.id);
    if (!foundFixedLoc) return expect(true).to.equal(false);

    expect(foundFixedLoc.name).to.equal(randomFixedLoc.name);
    expect(foundFixedLoc.namespace).to.equal(randomFixedLoc.namespace);
    expect(foundFixedLoc.scope).to.equal(randomFixedLoc.scope);
    expect(foundFixedLoc.locString.mainStr).to.equal('testupd1');
    expect(foundFixedLoc.locString.secStr).to.equal('testupd2');
    expect(foundFixedLoc.locString.altStr).to.equal('testupd3');

    const foundInInmemFixedLoc = updatedInmemFixedLocs.find(fixedLoc =>
      fixedLoc.name === randomFixedLoc.name &&
      fixedLoc.namespace === randomFixedLoc.namespace &&
      fixedLoc.scope === randomFixedLoc.scope
    );
    if (!foundInInmemFixedLoc) return expect(true).to.equal(false);

    expect(foundInInmemFixedLoc.locString.mainStr).to.equal('testupd1');
    expect(foundInInmemFixedLoc.locString.secStr).to.equal('testupd2');
    expect(foundInInmemFixedLoc.locString.altStr).to.equal('testupd3');

  });

  it('should update only loc strings of fixed locs, never other properties', async () => {

    await fixedLocService.initFixedLocs(fixedLocsPath, fixedLocsExt);

    const fixedLocs = await fixedLocService.getAll();

    const randomFixedLoc = fixedLocs[Math.floor(Math.random() * (fixedLocs.length - 1))];

    await fixedLocService.update({
      id: randomFixedLoc.id,
      name: 'testupd',
      namespace: 'testupd',
      scope: 'testupd',
      locString: {
        id: randomFixedLoc.locString.id,
        mainStr: 'testupd1',
        secStr: 'testupd2',
        altStr: 'testupd3'
      }
    });

    const updatedFixedLocs = await fixedLocService.getAll();

    expect(updatedFixedLocs.length).to.equal(fixedLocs.length);

    const updFixedLoc = updatedFixedLocs.find(fixedLoc => fixedLoc.id === randomFixedLoc.id);
    if (!updFixedLoc) return expect(true).to.equal(false);

    expect(updFixedLoc.name).to.equal(randomFixedLoc.name);
    expect(updFixedLoc.namespace).to.equal(randomFixedLoc.namespace);
    expect(updFixedLoc.scope).to.equal(randomFixedLoc.scope);
    expect(updFixedLoc.locString.mainStr).to.equal('testupd1');
    expect(updFixedLoc.locString.secStr).to.equal('testupd2');
    expect(updFixedLoc.locString.altStr).to.equal('testupd3');

  });

});