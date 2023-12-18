import { expect } from 'chai';
import 'mocha';
import { FixedLoc, Language, Loc } from '../models';
import { LocParentType, LocType, NumericToFixedLocScopeMapping } from '@m-cafe-app/shared-constants';
import { dbHandler } from '../db';



describe('Database FixedLoc model tests', () => {

  before(async () => {
    await dbHandler.pingDb();
  });

  beforeEach(async () => {
    await FixedLoc.scope('admin').destroy({ force: true, where: {} });
  });

  after(async () => {
    await FixedLoc.scope('admin').destroy({ force: true, where: {} });
    await Loc.destroy({ force: true, where: {} });
  });

  it('FixedLoc creation test', async () => {

    const randomFixedLocScope =
      NumericToFixedLocScopeMapping[Math.floor(Math.random() * Object.keys(NumericToFixedLocScopeMapping).length)];

    const fixedLoc = await FixedLoc.create({
      name: 'test',
      namespace: 'test',
      scope: randomFixedLocScope
    });

    expect(fixedLoc).to.exist;

  });

  it('FixedLoc update test', async () => {

    const randomFixedLocScope =
      NumericToFixedLocScopeMapping[Math.floor(Math.random() * Object.keys(NumericToFixedLocScopeMapping).length)];

    const fixedLoc = await FixedLoc.create({
      name: 'test',
      namespace: 'test',
      scope: randomFixedLocScope
    });

    fixedLoc.namespace = 'test2';

    await fixedLoc.save();

    const fixedLocInDB = await FixedLoc.scope('admin').findOne({ where: { name: 'test' } });

    expect(fixedLocInDB?.namespace).to.equal('test2');

  });

  it('FixedLoc delete test', async () => {

    const randomFixedLocScope =
      NumericToFixedLocScopeMapping[Math.floor(Math.random() * Object.keys(NumericToFixedLocScopeMapping).length)];

    const fixedLoc = await FixedLoc.create({
      name: 'test',
      namespace: 'test',
      scope: randomFixedLocScope
    });

    await fixedLoc.destroy();

    const fixedLocInDB = await FixedLoc.scope('admin').findOne({ where: { name: 'test' } });

    expect(fixedLocInDB).to.not.exist;

  });

  it('FixedLoc retrieve with associated Loc test', async () => {

    const randomFixedLocScope =
      NumericToFixedLocScopeMapping[Math.floor(Math.random() * Object.keys(NumericToFixedLocScopeMapping).length)];

    const fixedLoc = await FixedLoc.create({
      name: 'test',
      namespace: 'test',
      scope: randomFixedLocScope
    });

    const language = await Language.create({
      name: 'test',
      code: 'test'
    });

    const loc = await Loc.create({
      languageId: language.id,
      locType: LocType.Text,
      parentType: LocParentType.FixedLoc,
      parentId: fixedLoc.id,
      text: 'test'
    });

    const fixedLocInDB = await FixedLoc.scope('all').findByPk(fixedLoc.id, {
      include: [
        {
          model: Loc,
          as: 'locs'
        }
      ]
    });

    if (!fixedLocInDB || !fixedLocInDB?.locs) {
      return expect(fixedLocInDB).to.exist;
    }

    expect(fixedLocInDB.name).to.equal(fixedLoc.name);
    expect(fixedLocInDB.locs.length).to.equal(1);
    expect(fixedLocInDB.locs[0].text).to.equal(loc.text);
    expect(fixedLocInDB.locs[0].languageId).to.equal(language.id);
    
  });

});