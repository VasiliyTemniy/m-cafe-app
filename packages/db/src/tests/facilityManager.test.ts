import { expect } from 'chai';
import 'mocha';
import { Address, Facility, FacilityManager, User } from '../models';
import { dbHandler } from '../db';
import { NumericToFacilityTypeMapping } from '@m-cafe-app/shared-constants';



describe('Database FacilityManager model tests', () => {

  let facilityAddress: Address;
  let facility: Facility;
  let user: User;

  before(async () => {
    await dbHandler.pingDb();

    facilityAddress = await Address.create({
      city: 'тест',
      street: 'тест'
    });

    const randomFacilityType =
      NumericToFacilityTypeMapping[Math.floor(Math.random() * Object.keys(NumericToFacilityTypeMapping).length)];

    facility = await Facility.create({
      addressId: facilityAddress.id,
      facilityType: randomFacilityType
    });

    user = await User.create({
      lookupHash: 'testlonger',
      phonenumber: '123123123',
    });
  });

  beforeEach(async () => {
    await FacilityManager.destroy({ force: true, where: {} });
  });

  after(async () => {
    await Facility.destroy({ force: true, where: {} });
    await FacilityManager.destroy({ force: true, where: {} });
    await Address.destroy({ force: true, where: {} });
    await User.scope('all').destroy({ force: true, where: {} });
  });

  it('FacilityManager creation test', async () => {

    const facilityManager = await FacilityManager.create({
      userId: user.id,
      facilityId: facility.id
    });

    expect(facilityManager).to.exist;

  });

  it('FacilityManager delete test', async () => {

    const facilityManager = await FacilityManager.create({
      userId: user.id,
      facilityId: facility.id
    });

    await facilityManager.destroy();

    const facilityManagerInDB = await FacilityManager.findOne({ where: { userId: user.id } });

    expect(facilityManagerInDB).to.not.exist;

  });

});