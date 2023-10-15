import { expect } from 'chai';
import 'mocha';
import { FixedLoc, LocString } from '../models';
import { fixedLocFilter, fixedLocsScopes } from '@m-cafe-app/shared-constants';
import { dbHandler } from '../db';



describe('Database FixedLoc model tests', () => {

  let locString: LocString;

  before(async () => {
    await dbHandler.pingDb();

    locString = await LocString.create({
      mainStr: 'тест',
      secStr: 'тест',
      altStr: 'тест'
    });
  });

  beforeEach(async () => {
    await FixedLoc.scope('admin').destroy({ force: true, where: {} });
  });

  after(async () => {
    await FixedLoc.scope('admin').destroy({ force: true, where: {} });
    await LocString.destroy({ force: true, where: {} });
  });

  it('FixedLoc creation test', async () => {

    const randomFixedLocScope = fixedLocsScopes[Math.floor(Math.random() * fixedLocsScopes.length)];

    const fixedLoc = await FixedLoc.create({
      name: 'test',
      namespace: 'test',
      scope: randomFixedLocScope,
      locStringId: locString.id
    });

    expect(fixedLoc).to.exist;

  });

  it('FixedLoc update test', async () => {

    const randomFixedLocScope = fixedLocsScopes[Math.floor(Math.random() * fixedLocsScopes.length)];

    const fixedLoc = await FixedLoc.create({
      name: 'test',
      namespace: 'test',
      scope: randomFixedLocScope,
      locStringId: locString.id
    });

    fixedLoc.namespace = 'test2';

    await fixedLoc.save();

    const fixedLocInDB = await FixedLoc.scope('admin').findOne({ where: { name: 'test' } });

    expect(fixedLocInDB?.namespace).to.equal('test2');

  });

  it('FixedLoc delete test', async () => {

    const randomFixedLocScope = fixedLocsScopes[Math.floor(Math.random() * fixedLocsScopes.length)];

    const fixedLoc = await FixedLoc.create({
      name: 'test',
      namespace: 'test',
      scope: randomFixedLocScope,
      locStringId: locString.id
    });

    await fixedLoc.destroy();

    const fixedLocInDB = await FixedLoc.scope('admin').findOne({ where: { name: 'test' } });

    expect(fixedLocInDB).to.not.exist;

  });

  it('FixedLoc default scope test: does not include filtered values', async () => {

    await FixedLoc.create({
      name: 'test',
      namespace: 'test',
      scope: 'shared',
      locStringId: locString.id
    });

    const filteredLocString = await LocString.create({
      mainStr: fixedLocFilter
    });

    await FixedLoc.create({
      name: 'test2',
      namespace: 'test',
      scope: 'shared',
      locStringId: filteredLocString.id
    });

    const fixedLocsInDB = await FixedLoc.findAll({});

    expect(fixedLocsInDB).to.have.lengthOf(1);

    const allFixedLocsInDB = await FixedLoc.scope('all').findAll({});

    expect(allFixedLocsInDB).to.have.lengthOf(1);

    const adminFixedLocsInDB = await FixedLoc.scope('admin').findAll({});

    expect(adminFixedLocsInDB).to.have.lengthOf(2);

  });

  it('FixedLoc default scope test: includes locString', async () => {

    await FixedLoc.create({
      name: 'test',
      namespace: 'test',
      scope: 'shared',
      locStringId: locString.id
    });

    const fixedLocInDB = await FixedLoc.scope('all').findOne({ where: { name: 'test' } });

    expect(fixedLocInDB?.locString).to.exist;
    expect(fixedLocInDB?.locString?.id).to.equal(locString.id);
    expect(fixedLocInDB?.locString?.mainStr).to.equal(locString.mainStr);

  });

});