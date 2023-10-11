import { expect } from 'chai';
import 'mocha';
import { Address } from '../models';
import { dbHandler } from '../db';



describe('Database Address model tests', () => {

  before(async () => {
    await dbHandler.pingDb();
  });

  beforeEach(async () => {
    await Address.scope('all').destroy({ force: true, where: {} });
  });

  after(async () => {
    await Address.scope('all').destroy({ force: true, where: {} });
  });

  it('Address creation test', async () => {

    const address = await Address.create({
      region: 'тест',
      regionDistrict: 'тест',
      city: 'тест',
      cityDistrict: 'тест',
      street: 'тест',
      house: 'тест',
      entrance: 'тест',
      floor: 1,
      flat: 'тест',
      entranceKey: 'тест'
    });

    expect(address).to.exist;

  });

  it('Address update test', async () => {
    
    const address = await Address.create({
      region: 'тест',
      regionDistrict: 'тест',
      city: 'тест',
      cityDistrict: 'тест',
      street: 'тест',
      house: 'тест',
      entrance: 'тест',
      floor: 1,
      flat: 'тест',
      entranceKey: 'тест'
    });

    address.region = 'тест2';

    await address.save();

    const addressInDB = await Address.scope('all').findOne({ where: { id: address.id } });

    expect(addressInDB).to.exist;
    expect(addressInDB?.region).to.equal('тест2');

  });

  it('Address delete test', async () => {
    
    const address = await Address.create({
      region: 'тест',
      regionDistrict: 'тест',
      city: 'тест',
      cityDistrict: 'тест',
      street: 'тест',
      house: 'тест',
      entrance: 'тест',
      floor: 1,
      flat: 'тест',
      entranceKey: 'тест'
    });

    await address.destroy();

    const addressInDB = await Address.scope('all').findOne({ where: { id: address.id } });

    expect(addressInDB).to.not.exist;

  });

  it('Address default scope test: does not include timestamps', async () => {
    
    const address = await Address.create({
      region: 'тест',
      regionDistrict: 'тест',
      city: 'тест',
      cityDistrict: 'тест',
      street: 'тест',
      house: 'тест',
      entrance: 'тест',
      floor: 1,
      flat: 'тест',
      entranceKey: 'тест'
    });

    const addressInDB = await Address.findOne({ where: { id: address.id } });

    expect(addressInDB?.createdAt).to.not.exist;
    expect(addressInDB?.updatedAt).to.not.exist;

  });

});