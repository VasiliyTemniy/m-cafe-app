import type { LocString } from '../models';
import { expect } from 'chai';
import 'mocha';
import { dbHandler } from '../db';
import { randomEnumValue } from './db_test_helper';



describe('Database Loc model tests', () => {

  let locString: LocString;

  const pickedLanguageCode = randomEnumValue('LanguageCode');
  const pickedLocType = randomEnumValue('LocType');
  const pickedLocParentType = randomEnumValue('LocParentType');

  before(async () => {
    await dbHandler.pingDb();

    locString = await dbHandler.models.LocString.create({
      text: 'тест'
    });
  });

  beforeEach(async () => {
    await dbHandler.models.Loc.destroy({ force: true, where: {} });
  });

  after(async () => {
    await dbHandler.models.Loc.destroy({ force: true, where: {} });
  });

  it('Loc creation test', async () => {

    const loc = await dbHandler.models.Loc.create({
      locStringId: locString.id,
      languageCode: pickedLanguageCode,
      locType: pickedLocType,
      parentType: pickedLocParentType,
      parentId: 0, // does not exist
    });

    expect(loc).to.exist;

  });

  // All model fields are parts of a primary key, so update cannot happen
  // it('Loc update test', async () => {
    
  //   const loc = await dbHandler.models.Loc.create({
  //     locStringId: locString.id,
  //     languageCode: pickedLanguageCode,
  //     locType: pickedLocType,
  //     parentType: pickedLocParentType,
  //     parentId: 0, // does not exist
  //   });

  //   loc.parentId = 100;

  //   await loc.save();

  //   const locInDB = await dbHandler.models.Loc.findOne({ where: {
  //     locStringId: locString.id,
  //     languageCode: pickedLanguageCode,
  //     locType: pickedLocType,
  //     parentType: pickedLocParentType,
  //   } });

  //   expect(locInDB).to.exist;
  //   expect(locInDB?.parentId).to.equal(100);

  // });

  it('Loc delete test', async () => {
    
    const loc = await dbHandler.models.Loc.create({
      locStringId: locString.id,
      languageCode: pickedLanguageCode,
      locType: pickedLocType,
      parentType: pickedLocParentType,
      parentId: 0, // does not exist
    });

    await loc.destroy();

    const locInDB = await dbHandler.models.Loc.findOne({ where: {
      locStringId: locString.id,
      languageCode: pickedLanguageCode,
      locType: pickedLocType,
      parentType: pickedLocParentType,
      parentId: 0,
    } });

    expect(locInDB).to.not.exist;

  });

  it('Loc default scope test: does not include timestamps', async () => {
    
    await dbHandler.models.Loc.create({
      locStringId: locString.id,
      languageCode: pickedLanguageCode,
      locType: pickedLocType,
      parentType: pickedLocParentType,
      parentId: 0, // does not exist
    });

    const locInDB = await dbHandler.models.Loc.findOne({ where: {
      locStringId: locString.id,
      languageCode: pickedLanguageCode,
      locType: pickedLocType,
      parentType: pickedLocParentType,
      parentId: 0,
    } });

    expect(locInDB?.createdAt).to.not.exist;
    expect(locInDB?.updatedAt).to.not.exist;

  });

});