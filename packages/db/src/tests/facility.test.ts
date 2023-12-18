import { expect } from 'chai';
import 'mocha';
import { Address, Facility } from '../models';
import { dbHandler } from '../db';
import { NumericToFacilityTypeMapping } from '@m-cafe-app/shared-constants';



describe('Database Facility model tests', () => {

  let facilityAddress: Address;

  before(async () => {
    await dbHandler.pingDb();

    facilityAddress = await Address.create({
      city: 'тест',
      street: 'тест'
    });
  });

  beforeEach(async () => {
    await Facility.destroy({ force: true, where: {} });
  });

  after(async () => {
    await Facility.destroy({ force: true, where: {} });
    await Address.destroy({ force: true, where: {} });
  });

  it('Facility creation test', async () => {

    const randomFacilityType =
      NumericToFacilityTypeMapping[Math.floor(Math.random() * Object.keys(NumericToFacilityTypeMapping).length)];

    const facility = await Facility.create({
      addressId: facilityAddress.id,
      facilityType: randomFacilityType
    });

    expect(facility).to.exist;

  });

  it('Facility update test', async () => {

    const randomFacilityType =
      NumericToFacilityTypeMapping[Math.floor(Math.random() * Object.keys(NumericToFacilityTypeMapping).length)];
    
    const facility = await Facility.create({
      addressId: facilityAddress.id,
      facilityType: randomFacilityType
    });

    const newFacilityAddress = await Address.create({
      city: 'тест2',
      street: 'тест2'
    });

    facility.addressId = newFacilityAddress.id;

    await facility.save();

    const facilityInDB = await Facility.findOne({ where: { id: facility.id } });

    expect(facilityInDB?.addressId).to.equal(newFacilityAddress.id);

  });

  it('Facility delete test', async () => {

    const randomFacilityType =
      NumericToFacilityTypeMapping[Math.floor(Math.random() * Object.keys(NumericToFacilityTypeMapping).length)];

    const facility = await Facility.create({
      addressId: facilityAddress.id,
      facilityType: randomFacilityType
    });

    await facility.destroy();

    const facilityInDB = await Facility.findOne({ where: { id: facility.id } });

    expect(facilityInDB).to.not.exist;

  });

  it('Facility default scope test: does not include timestamps', async () => {
    
    const randomFacilityType =
      NumericToFacilityTypeMapping[Math.floor(Math.random() * Object.keys(NumericToFacilityTypeMapping).length)];

    const facility = await Facility.create({
      addressId: facilityAddress.id,
      facilityType: randomFacilityType
    });

    const facilityInDB = await Facility.findOne({ where: { id: facility.id } });

    expect(facilityInDB?.createdAt).to.not.exist;
    expect(facilityInDB?.updatedAt).to.not.exist;

  });

});