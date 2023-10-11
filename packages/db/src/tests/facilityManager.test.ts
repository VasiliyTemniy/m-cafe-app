import { expect } from 'chai';
import 'mocha';
import { Address, Facility, LocString, FacilityManager, User } from '../models';
import { dbHandler } from '../db';



describe('Database FacilityManager model tests', () => {

  let facilityNameLoc: LocString;
  let facilityDescriptionLoc: LocString;
  let facilityAddress: Address;
  let facility: Facility;
  let user: User;

  before(async () => {
    await dbHandler.pingDb();

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

    facility = await Facility.create({
      nameLocId: facilityNameLoc.id,
      descriptionLocId: facilityDescriptionLoc.id,
      addressId: facilityAddress.id
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
    await LocString.destroy({ force: true, where: {} });
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