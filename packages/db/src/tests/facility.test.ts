import { expect } from 'chai';
import 'mocha';
import { connectToDatabase } from '../db';
import { Address, Facility, LocString } from '../models';


await connectToDatabase();


describe('Database Facility model tests', () => {

  let facilityNameLoc: LocString;
  let facilityDescriptionLoc: LocString;
  let facilityAddress: Address;

  before(async () => {
    facilityNameLoc = await LocString.create({
      mainStr: 'тест',
      secStr: 'тест',
      altStr: 'тест'
    });

    facilityDescriptionLoc = await LocString.create({
      mainStr: 'тест',
      secStr: 'тест',
      altStr: 'тест'
    });

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
    await LocString.destroy({ force: true, where: {} });
    await Address.destroy({ force: true, where: {} });
  });

  it('Facility creation test', async () => {

    const facility = await Facility.create({
      nameLocId: facilityNameLoc.id,
      descriptionLocId: facilityDescriptionLoc.id,
      addressId: facilityAddress.id
    });

    expect(facility).to.exist;

  });

  it('Facility update test', async () => {
    
    const facility = await Facility.create({
      nameLocId: facilityNameLoc.id,
      descriptionLocId: facilityDescriptionLoc.id,
      addressId: facilityAddress.id
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

    const facility = await Facility.create({
      nameLocId: facilityNameLoc.id,
      descriptionLocId: facilityDescriptionLoc.id,
      addressId: facilityAddress.id
    });

    await facility.destroy();

    const facilityInDB = await Facility.findOne({ where: { id: facility.id } });

    expect(facilityInDB).to.not.exist;

  });

  it('Facility default scope test: does not include timestamps', async () => {
    
    const facility = await Facility.create({
      nameLocId: facilityNameLoc.id,
      descriptionLocId: facilityDescriptionLoc.id,
      addressId: facilityAddress.id
    });

    const facilityInDB = await Facility.findOne({ where: { id: facility.id } });

    expect(facilityInDB?.createdAt).to.not.exist;
    expect(facilityInDB?.updatedAt).to.not.exist;

  });

});