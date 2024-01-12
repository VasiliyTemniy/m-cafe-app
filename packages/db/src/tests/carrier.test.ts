import { expect } from 'chai';
import 'mocha';
import { dbHandler } from '../db';



describe('Database Carrier model tests', () => {

  before(async () => {
    await dbHandler.pingDb();
  });

  beforeEach(async () => {
    await dbHandler.models.Carrier.destroy({ force: true, where: {} });
  });

  after(async () => {
    await dbHandler.models.Carrier.destroy({ force: true, where: {} });
  });

  it('Carrier creation test', async () => {

    const carrier = await dbHandler.models.Carrier.create({
      name: 'Vasya',
      description: 'test',
    });

    expect(carrier).to.exist;

  });

  it('Carrier update test', async () => {
    
    const carrier = await dbHandler.models.Carrier.create({
      name: 'Vasya',
      description: 'test',
    });

    carrier.description = 'test2';

    await carrier.save();

    const carrierInDB = await dbHandler.models.Carrier.findOne({ where: {
      id: carrier.id
    } });

    expect(carrierInDB).to.exist;
    expect(carrierInDB?.description).to.equal('test2');

  });

  it('Carrier delete test', async () => {
    
    const carrier = await dbHandler.models.Carrier.create({
      name: 'Vasya',
      description: 'test',
    });

    await carrier.destroy();

    const carrierInDB = await dbHandler.models.Carrier.findOne({ where: {

    } });

    expect(carrierInDB).to.not.exist;

  });

  it('Carrier default scope test: does not include timestamps', async () => {
    
    const carrier = await dbHandler.models.Carrier.create({
      name: 'Vasya',
      description: 'test',
    });

    const carrierInDB = await dbHandler.models.Carrier.findOne({ where: {
      id: carrier.id
    } });

    expect(carrierInDB?.createdAt).to.not.exist;
    expect(carrierInDB?.updatedAt).to.not.exist;

  });

});