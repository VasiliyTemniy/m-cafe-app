import { expect } from 'chai';
import 'mocha';
import { dbHandler } from '../db';
import { createAddress, createOrgAdminManager, randomEnumValue } from './db_test_helper';



describe('Database Facility model tests', () => {

  let facilityAddress: InstanceType<typeof dbHandler.models.Address>;
  let organization: InstanceType<typeof dbHandler.models.Organization>;
  let creator: InstanceType<typeof dbHandler.models.User>;

  const pickedFacilityType = randomEnumValue('FacilityType');

  before(async () => {
    await dbHandler.pingDb();

    ({ address: facilityAddress } = await createAddress(dbHandler));

    ({ creator, organization } = await createOrgAdminManager(dbHandler));
  });

  beforeEach(async () => {
    await dbHandler.models.Facility.destroy({ force: true, where: {} });
  });

  after(async () => {
    await dbHandler.models.Facility.destroy({ force: true, where: {} });
    await dbHandler.models.Organization.destroy({ force: true, where: {} });
    await dbHandler.models.User.destroy({ force: true, where: {} });
  });

  it('Facility creation test', async () => {

    const facility = await dbHandler.models.Facility.create({
      organizationId: organization.id,
      createdBy: creator.id,
      updatedBy: creator.id,
      addressId: facilityAddress.id,
      facilityType: pickedFacilityType
    });

    expect(facility).to.exist;

  });

  it('Facility update test', async () => {
    
    const facility = await dbHandler.models.Facility.create({
      organizationId: organization.id,
      createdBy: creator.id,
      updatedBy: creator.id,
      addressId: facilityAddress.id,
      facilityType: pickedFacilityType
    });

    const newFacilityAddress = await dbHandler.models.Address.create({
      city: 'тест2',
      street: 'тест2'
    });

    facility.addressId = newFacilityAddress.id;

    await facility.save();

    const facilityInDB = await dbHandler.models.Facility.findOne({ where: { id: facility.id } });

    expect(facilityInDB?.addressId).to.equal(newFacilityAddress.id);

  });

  it('Facility delete test', async () => {

    const facility = await dbHandler.models.Facility.create({
      organizationId: organization.id,
      createdBy: creator.id,
      updatedBy: creator.id,
      addressId: facilityAddress.id,
      facilityType: pickedFacilityType
    });

    await facility.destroy();

    const facilityInDB = await dbHandler.models.Facility.findOne({ where: { id: facility.id } });

    expect(facilityInDB).to.not.exist;

  });

  it('Facility default scope test: does not include timestamps', async () => {

    const facility = await dbHandler.models.Facility.create({
      organizationId: organization.id,
      createdBy: creator.id,
      updatedBy: creator.id,
      addressId: facilityAddress.id,
      facilityType: pickedFacilityType
    });

    const facilityInDB = await dbHandler.models.Facility.findOne({ where: { id: facility.id } });

    expect(facilityInDB?.createdAt).to.not.exist;
    expect(facilityInDB?.updatedAt).to.not.exist;

  });

});