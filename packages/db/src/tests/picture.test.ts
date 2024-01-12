import { expect } from 'chai';
import 'mocha';
import { dbHandler } from '../db';
import { randomEnumValue } from './db_test_helper';



describe('Database Picture model tests', () => {

  const pickedPictureParentType = randomEnumValue('PictureParentType');

  before(async () => {
    await dbHandler.pingDb();
  });

  beforeEach(async () => {
    await dbHandler.models.Picture.destroy({ force: true, where: {} });
  });

  after(async () => {
    await dbHandler.models.Picture.destroy({ force: true, where: {} });
  });

  it('Picture creation test', async () => {

    // Minimal data
    const picture = await dbHandler.models.Picture.create({
      src: 'тест',
      parentId: 0, // not exists
      parentType: pickedPictureParentType,
      orderNumber: 1,
      totalDownloads: 1,
    });

    // Full data
    const picture2 = await dbHandler.models.Picture.create({
      src: 'тест2',
      parentId: 0, // not exists
      parentType: pickedPictureParentType,
      orderNumber: 2,
      totalDownloads: 1,
      url: 'тест',
    });

    expect(picture).to.exist;
    expect(picture2).to.exist;

  });

  it('Picture update test', async () => {
    
    const picture = await dbHandler.models.Picture.create({
      src: 'тест',
      parentId: 0, // not exists
      parentType: pickedPictureParentType,
      orderNumber: 1,
      totalDownloads: 1,
    });

    picture.src = 'тест2';

    await picture.save();

    const pictureInDB = await dbHandler.models.Picture.findOne({ where: { id: picture.id } });

    expect(pictureInDB?.src).to.equal('тест2');

  });

  it('Picture delete test', async () => {

    const picture = await dbHandler.models.Picture.create({
      src: 'тест',
      parentId: 0, // not exists
      parentType: pickedPictureParentType,
      orderNumber: 1,
      totalDownloads: 1,
    });

    await picture.destroy();

    const pictureInDB = await dbHandler.models.Picture.findOne({ where: { id: picture.id } });

    expect(pictureInDB).to.not.exist;

  });

  it('Picture default scope test: does not include timestamps', async () => {
    
    const picture = await dbHandler.models.Picture.create({
      src: 'тест',
      parentId: 0, // not exists
      parentType: pickedPictureParentType,
      orderNumber: 1,
      totalDownloads: 1,
    });

    const pictureInDB = await dbHandler.models.Picture.findOne({ where: { id: picture.id } });

    expect(pictureInDB?.createdAt).to.not.exist;
    expect(pictureInDB?.updatedAt).to.not.exist;

  });

});