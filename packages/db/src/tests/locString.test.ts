import { expect } from 'chai';
import 'mocha';
import { dbHandler } from '../db';



describe('Database LocString model tests', () => {

  before(async () => {
    await dbHandler.pingDb();
  });

  beforeEach(async () => {
    await dbHandler.models.LocString.destroy({ force: true, where: {} });
  });

  after(async () => {
    await dbHandler.models.LocString.destroy({ force: true, where: {} });
  });

  it('LocString creation test', async () => {

    const locString = await dbHandler.models.LocString.create({
      text: 'test'
    });

    expect(locString).to.exist;

  });

  it('LocString update test', async () => {
    
    const locString = await dbHandler.models.LocString.create({
      text: 'test'
    });

    locString.text = 'test2';

    await locString.save();

    const locStringInDB = await dbHandler.models.LocString.findOne({ where: {

    } });

    expect(locStringInDB).to.exist;
    expect(locStringInDB?.text).to.equal('test2');

  });

  it('LocString delete test', async () => {
    
    const locString = await dbHandler.models.LocString.create({
      text: 'test'
    });

    await locString.destroy();

    const locStringInDB = await dbHandler.models.LocString.findOne({ where: {

    } });

    expect(locStringInDB).to.not.exist;

  });

});