import { expect, assert } from 'chai';
import 'mocha';
import { LanguageCode, LocParentType, LocType } from '@m-market-app/shared-constants';
import { dbHandler } from '../db';
import { randomEnumValue } from './db_test_helper';



describe('Database FixedLoc model tests', () => {

  const pickedScope = randomEnumValue('FixedLocScope');

  before(async () => {
    await dbHandler.pingDb();
  });

  beforeEach(async () => {
    await dbHandler.models.FixedLoc.scope('all').destroy({ force: true, where: {} });
  });

  after(async () => {
    await dbHandler.models.FixedLoc.scope('all').destroy({ force: true, where: {} });
    await dbHandler.models.Loc.destroy({ force: true, where: {} });
    await dbHandler.models.LocString.destroy({ force: true, where: {} });
  });

  it('FixedLoc creation test', async () => {

    const fixedLoc = await dbHandler.models.FixedLoc.create({
      name: 'test',
      namespace: 'test',
      scope: pickedScope
    });

    expect(fixedLoc).to.exist;

  });

  it('FixedLoc update test', async () => {

    const fixedLoc = await dbHandler.models.FixedLoc.create({
      name: 'test',
      namespace: 'test',
      scope: pickedScope
    });

    fixedLoc.namespace = 'test2';

    await fixedLoc.save();

    const fixedLocInDB = await dbHandler.models.FixedLoc.scope('admin').findOne({ where: { name: 'test' } });

    expect(fixedLocInDB?.namespace).to.equal('test2');

  });

  it('FixedLoc delete test', async () => {

    const fixedLoc = await dbHandler.models.FixedLoc.create({
      name: 'test',
      namespace: 'test',
      scope: pickedScope
    });

    await fixedLoc.destroy();

    const fixedLocInDB = await dbHandler.models.FixedLoc.scope('admin').findOne({ where: { name: 'test' } });

    expect(fixedLocInDB).to.not.exist;

  });

  it('FixedLoc retrieve with associated Loc test', async () => {

    const fixedLoc = await dbHandler.models.FixedLoc.create({
      name: 'test',
      namespace: 'test',
      scope: pickedScope
    });

    const locString = await dbHandler.models.LocString.create({
      text: 'test'
    });

    const loc = await dbHandler.models.Loc.create({
      locStringId: locString.id,
      languageCode: LanguageCode['en-US'],
      locType: LocType.Text,
      parentType: LocParentType.FixedLoc,
      parentId: fixedLoc.id,
    });

    const fixedLocInDB = await dbHandler.models.FixedLoc.scope('all').findByPk(fixedLoc.id, {
      include: [
        {
          model: dbHandler.models.Loc,
          as: 'locs',
          include: [
            {
              model: dbHandler.models.LocString,
              as: 'locString'
            }
          ]
        }
      ]
    });

    if (!fixedLocInDB || !fixedLocInDB?.locs || !fixedLocInDB?.locs[0] || !fixedLocInDB?.locs[0].locString) {
      assert.fail('associated retrieval failed or fixed loc creation failed');
    }

    expect(fixedLocInDB.name).to.equal(fixedLoc.name);
    expect(fixedLocInDB.locs.length).to.equal(1);
    expect(fixedLocInDB.locs[0].locString.text).to.equal(locString.text);
    expect(fixedLocInDB.locs[0].languageCode).to.equal(loc.languageCode);
    
  });

});