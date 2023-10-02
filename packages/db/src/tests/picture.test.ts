import { expect } from 'chai';
import 'mocha';
import { connectToDatabase } from '../db';
import { Picture, LocString } from '../models';


await connectToDatabase();


describe('Database Picture model tests', () => {

  let pictureAltTextLoc: LocString;

  before(async () => {
    pictureAltTextLoc = await LocString.create({
      mainStr: 'тест',
      secStr: 'тест',
      altStr: 'тест'
    });
  });

  beforeEach(async () => {
    await Picture.destroy({ force: true, where: {} });
  });

  after(async () => {
    await Picture.destroy({ force: true, where: {} });
    await LocString.destroy({ force: true, where: {} });
  });

  it('Picture creation test', async () => {

    const picture = await Picture.create({
      altTextLocId: pictureAltTextLoc.id,
      src: 'тест'
    });

    expect(picture).to.exist;

  });

  it('Picture update test', async () => {
    
    const picture = await Picture.create({
      altTextLocId: pictureAltTextLoc.id,
      src: 'тест'
    });

    picture.src = 'тест2';

    await picture.save();

    const pictureInDB = await Picture.findOne({ where: { id: picture.id } });

    expect(pictureInDB?.src).to.equal('тест2');

  });

  it('Picture delete test', async () => {

    const picture = await Picture.create({
      altTextLocId: pictureAltTextLoc.id,
      src: 'тест'
    });

    await picture.destroy();

    const pictureInDB = await Picture.findOne({ where: { id: picture.id } });

    expect(pictureInDB).to.not.exist;

  });

  it('Picture default scope test: does not include timestamps', async () => {
    
    const picture = await Picture.create({
      altTextLocId: pictureAltTextLoc.id,
      src: 'тест'
    });

    const pictureInDB = await Picture.findOne({ where: { id: picture.id } });

    expect(pictureInDB?.createdAt).to.not.exist;
    expect(pictureInDB?.updatedAt).to.not.exist;

  });

});