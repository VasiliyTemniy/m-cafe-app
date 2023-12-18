import { expect } from 'chai';
import 'mocha';
import { Picture } from '../models';
import { dbHandler } from '../db';
import { NumericToPictureParentTypeMapping } from '@m-cafe-app/shared-constants';



describe('Database Picture model tests', () => {

  before(async () => {
    await dbHandler.pingDb();
  });

  beforeEach(async () => {
    await Picture.destroy({ force: true, where: {} });
  });

  after(async () => {
    await Picture.destroy({ force: true, where: {} });
  });

  it('Picture creation test', async () => {

    const randomPictureParentType = 
      NumericToPictureParentTypeMapping[Math.floor(Math.random() * Object.keys(NumericToPictureParentTypeMapping).length)];

    const picture = await Picture.create({
      src: 'тест',
      parentId: 0, // not exists
      parentType: randomPictureParentType,
      orderNumber: 1
    });

    expect(picture).to.exist;

  });

  it('Picture update test', async () => {

    const randomPictureParentType = 
      NumericToPictureParentTypeMapping[Math.floor(Math.random() * Object.keys(NumericToPictureParentTypeMapping).length)];
    
    const picture = await Picture.create({
      src: 'тест',
      parentId: 0, // not exists
      parentType: randomPictureParentType,
      orderNumber: 1
    });

    picture.src = 'тест2';

    await picture.save();

    const pictureInDB = await Picture.findOne({ where: { id: picture.id } });

    expect(pictureInDB?.src).to.equal('тест2');

  });

  it('Picture delete test', async () => {

    const randomPictureParentType = 
      NumericToPictureParentTypeMapping[Math.floor(Math.random() * Object.keys(NumericToPictureParentTypeMapping).length)];

    const picture = await Picture.create({
      src: 'тест',
      parentId: 0, // not exists
      parentType: randomPictureParentType,
      orderNumber: 1
    });

    await picture.destroy();

    const pictureInDB = await Picture.findOne({ where: { id: picture.id } });

    expect(pictureInDB).to.not.exist;

  });

  it('Picture default scope test: does not include timestamps', async () => {

    const randomPictureParentType = 
      NumericToPictureParentTypeMapping[Math.floor(Math.random() * Object.keys(NumericToPictureParentTypeMapping).length)];
    
    const picture = await Picture.create({
      src: 'тест',
      parentId: 0, // not exists
      parentType: randomPictureParentType,
      orderNumber: 1
    });

    const pictureInDB = await Picture.findOne({ where: { id: picture.id } });

    expect(pictureInDB?.createdAt).to.not.exist;
    expect(pictureInDB?.updatedAt).to.not.exist;

  });

});