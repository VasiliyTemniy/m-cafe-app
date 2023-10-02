import { expect } from 'chai';
import 'mocha';
import { connectToDatabase } from '../db';
import { Picture, LocString, DynamicModule } from '../models';


await connectToDatabase();


describe('Database DynamicModule model tests', () => {

  let pictureAltTextLoc: LocString;
  let picture: Picture;
  let dynamicModuleLocString: LocString;

  before(async () => {
    pictureAltTextLoc = await LocString.create({
      mainStr: 'тест',
      secStr: 'тест',
      altStr: 'тест'
    });

    picture = await Picture.create({
      altTextLocId: pictureAltTextLoc.id,
      src: 'тест'
    });

    dynamicModuleLocString = await LocString.create({
      mainStr: 'тест',
      secStr: 'тест',
      altStr: 'тест'
    });
  });

  beforeEach(async () => {
    await DynamicModule.destroy({ force: true, where: {} });
  });

  after(async () => {
    await Picture.destroy({ force: true, where: {} });
    await LocString.destroy({ force: true, where: {} });
    await DynamicModule.destroy({ force: true, where: {} });
  });

  it('DynamicModule creation test', async () => {

    const dynamicModule = await DynamicModule.create({
      locStringId: dynamicModuleLocString.id,
      // moduleType will be validated by readonly list sometime so change this when time comes
      moduleType: 'тест',
      page: 'тест',
      placement: 1,
      placementType: 'afterMenuPicFirst',
      className: 'тест',
      inlineCss: 'тест',
      pictureId: picture.id,
      url: 'тест'
    });

    expect(dynamicModule).to.exist;

  });

  it('DynamicModule update test', async () => {
    
    const dynamicModule = await DynamicModule.create({
      locStringId: dynamicModuleLocString.id,
      // moduleType will be validated by readonly list sometime so change this when time comes
      moduleType: 'тест',
      page: 'тест',
      placement: 1,
      placementType: 'afterMenuPicFirst',
      className: 'тест',
      inlineCss: 'тест',
      pictureId: picture.id,
      url: 'тест'
    });

    dynamicModule.page = 'тест2';

    await dynamicModule.save();

    const dynamicModuleInDB = await DynamicModule.findOne({ where: { id: dynamicModule.id } });

    expect(dynamicModuleInDB?.page).to.equal('тест2');

  });

  it('DynamicModule delete test', async () => {

    const dynamicModule = await DynamicModule.create({
      locStringId: dynamicModuleLocString.id,
      // moduleType will be validated by readonly list sometime so change this when time comes
      moduleType: 'тест',
      page: 'тест',
      placement: 1,
      placementType: 'afterMenuPicFirst',
      className: 'тест',
      inlineCss: 'тест',
      pictureId: picture.id,
      url: 'тест'
    });

    await dynamicModule.destroy();

    const dynamicModuleInDB = await DynamicModule.findOne({ where: { id: dynamicModule.id } });

    expect(dynamicModuleInDB).to.not.exist;

  });

  it('DynamicModule default scope test: does not include timestamps', async () => {
   
    const dynamicModule = await DynamicModule.create({
      locStringId: dynamicModuleLocString.id,
      // moduleType will be validated by readonly list sometime so change this when time comes
      moduleType: 'тест',
      page: 'тест',
      placement: 1,
      placementType: 'afterMenuPicFirst',
      className: 'тест',
      inlineCss: 'тест',
      pictureId: picture.id,
      url: 'тест'
    });

    const dynamicModuleInDB = await DynamicModule.findOne({ where: { id: dynamicModule.id } });

    expect(dynamicModuleInDB?.createdAt).to.not.exist;
    expect(dynamicModuleInDB?.updatedAt).to.not.exist;

  });

});