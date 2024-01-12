import { expect } from 'chai';
import 'mocha';
import { dbHandler } from '../db';
import { createAddress, createCustomer } from './db_test_helper';



describe('Database UserAddress model tests', () => {

  let address: InstanceType<typeof dbHandler.models.Address>;
  let user: InstanceType<typeof dbHandler.models.User>;

  before(async () => {
    await dbHandler.pingDb();

    ({ address } = await createAddress(dbHandler));
    ({ customer: user } = await createCustomer(dbHandler));
    
  });

  beforeEach(async () => {
    await dbHandler.models.UserAddress.destroy({ force: true, where: {} });
  });

  after(async () => {
    await dbHandler.models.UserAddress.destroy({ force: true, where: {} });
    await dbHandler.models.User.destroy({ force: true, where: {} });
    await dbHandler.models.Address.destroy({ force: true, where: {} });
  });

  it('UserAddress creation test', async () => {

    const userAddress = await dbHandler.models.UserAddress.create({
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
    
    const userAddress = await dbHandler.models.UserAddress.create({
      userId: user.id,
      addressId: address.id
    });

    await userAddress.destroy();

    const userAddressInDB = await dbHandler.models.UserAddress.findOne({ where: { userId: userAddress.userId } });

    expect(userAddressInDB).to.not.exist;

  });

});