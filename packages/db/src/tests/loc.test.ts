import { expect } from 'chai';
import 'mocha';
import { Language, Loc } from '../models';
import { dbHandler } from '../db';
import { LocParentType, LocType } from '@m-cafe-app/shared-constants';



describe('Database Loc model tests', () => {

  let language: Language;

  before(async () => {
    await dbHandler.pingDb();

    language = await Language.create({
      name: 'тест',
      code: 'тест'
    });
  });

  beforeEach(async () => {
    await Loc.destroy({ force: true, where: {} });
  });

  after(async () => {
    await Loc.destroy({ force: true, where: {} });
    await Language.destroy({ force: true, where: {} });
  });

  it('Loc creation test', async () => {

    const loc = await Loc.create({
      languageId: language.id,
      locType: LocType.Description,
      parentType: LocParentType.Language,
      parentId: language.id,
      text: 'тест'
    });

    expect(loc).to.exist;

  });

  it('Loc update test', async () => {
    
    const loc = await Loc.create({
      languageId: language.id,
      locType: LocType.Description,
      parentType: LocParentType.Language,
      parentId: language.id,
      text: 'тест'
    });

    loc.text = 'тест2';

    await loc.save();

    const locInDB = await Loc.findOne({ where: {
      languageId: language.id,
      locType: LocType.Description,
      parentType: LocParentType.Language,
      parentId: language.id,
    } });

    expect(locInDB).to.exist;
    expect(locInDB?.text).to.equal('тест2');

  });

  it('Loc delete test', async () => {
    
    const loc = await Loc.create({
      languageId: language.id,
      locType: LocType.Description,
      parentType: LocParentType.Language,
      parentId: language.id,
      text: 'тест'
    });

    await loc.destroy();

    const locInDB = await Loc.findOne({ where: {
      languageId: language.id,
      locType: LocType.Description,
      parentType: LocParentType.Language,
      parentId: language.id,
    } });

    expect(locInDB).to.not.exist;

  });

  it('Loc default scope test: does not include timestamps', async () => {
    
    await Loc.create({
      languageId: language.id,
      locType: LocType.Description,
      parentType: LocParentType.Language,
      parentId: language.id,
      text: 'тест'
    });

    const locInDB = await Loc.findOne({ where: {
      languageId: language.id,
      locType: LocType.Description,
      parentType: LocParentType.Language,
      parentId: language.id,
    } });

    expect(locInDB?.createdAt).to.not.exist;
    expect(locInDB?.updatedAt).to.not.exist;

  });

});