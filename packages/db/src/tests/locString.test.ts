import { expect } from 'chai';
import 'mocha';
import { LocString } from '../models';
import { dbHandler } from '../db';



describe('Database LocString model tests', () => {

  before(async () => {
    await dbHandler.pingDb();
  });

  beforeEach(async () => {
    await LocString.destroy({ force: true, where: {} });
  });

  after(async () => {
    await LocString.destroy({ force: true, where: {} });
  });

  it('LocString creation test', async () => {

    const locString = await LocString.create({
      mainStr: 'тест',
      secStr: 'тест',
      altStr: 'тест'
    });

    expect(locString).to.exist;

  });

  it('LocString update test', async () => {
    
    const locString = await LocString.create({
      mainStr: 'тест',
      secStr: 'тест',
      altStr: 'тест'
    });

    locString.mainStr = 'тест2';

    await locString.save();

    const locStringInDB = await LocString.findOne({ where: { id: locString.id } });

    expect(locStringInDB).to.exist;
    expect(locStringInDB?.mainStr).to.equal('тест2');

  });

  it('LocString delete test', async () => {
    
    const locString = await LocString.create({
      mainStr: 'тест',
      secStr: 'тест',
      altStr: 'тест'
    });

    await locString.destroy();

    const locStringInDB = await LocString.findOne({ where: { id: locString.id } });

    expect(locStringInDB).to.not.exist;

  });

  it('LocString default scope test: does not include timestamps', async () => {
    
    const locString = await LocString.create({
      mainStr: 'тест',
      secStr: 'тест',
      altStr: 'тест'
    });

    const locStringInDB = await LocString.findOne({ where: { id: locString.id } });

    expect(locStringInDB?.createdAt).to.not.exist;
    expect(locStringInDB?.updatedAt).to.not.exist;

  });

});