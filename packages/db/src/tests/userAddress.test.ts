import { expect } from 'chai';
import 'mocha';
import { Address, User, UserAddress } from '../models';
import { dbHandler } from '../db';



describe('Database UserAddress model tests', () => {

  let address: Address;
  let user: User;

  before(async () => {
    await dbHandler.pingDb();

    address = await Address.create({
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

    user = await User.create({
      name: 'тест',
      phonenumber: '123123123',
      lookupHash: 'testlonger',
    });
  });

  beforeEach(async () => {
    await UserAddress.destroy({ force: true, where: {} });
  });

  after(async () => {
    await User.scope('all').destroy({ force: true, where: {} });
    await Address.scope('all').destroy({ force: true, where: {} });
  });

  it('UserAddress creation test', async () => {

    const userAddress = await UserAddress.create({
      userId: user.id,
      addressId: address.id
    });

    expect(userAddress).to.exist;

    const derivedUserAddresses = await user.getAddresses();

    expect(derivedUserAddresses).to.exist;
    expect(derivedUserAddresses.length).to.equal(1);
    expect(derivedUserAddresses[0].id).to.equal(address.id);

  });

  it('UserAddress delete test', async () => {
    
    const userAddress = await UserAddress.create({
      userId: user.id,
      addressId: address.id
    });

    await userAddress.destroy();

    const userAddressInDB = await UserAddress.findOne({ where: { userId: userAddress.userId } });

    expect(userAddressInDB).to.not.exist;

  });

});