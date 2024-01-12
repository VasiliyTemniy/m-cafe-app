import { expect } from 'chai';
import 'mocha';
import { dbHandler } from '../db';
import { UserRights } from '@m-cafe-app/shared-constants';



describe('Database User model tests', () => {

  before(async () => {
    await dbHandler.pingDb();
  });

  beforeEach(async () => {
    await dbHandler.models.User.scope('all').destroy({ force: true, where: {} });
  });

  after(async () => {
    await dbHandler.models.User.scope('all').destroy({ force: true, where: {} });
  });

  it('User сreation test', async () => {

    const user = await dbHandler.models.User.create({
      username: 'test',
      phonenumber: '123123123',
      email: 'test@test.com',
      birthdate: new Date(),
      rights: UserRights.Customer,
      lookupHash: 'testlonger',
      lookupNoise: 1
    });

    expect(user).to.exist;

  });

  it('User update test', async () => {
    
    const user = await dbHandler.models.User.create({
      username: 'test',
      phonenumber: '123123123',
      email: 'test@test.com',
      birthdate: new Date(),
      rights: UserRights.Customer,
      lookupHash: 'testlonger',
      lookupNoise: 1
    });

    user.username = 'test2';

    await user.save();

    const userInDB = await dbHandler.models.User.findByPk(user.id);

    expect(userInDB).to.exist;
    expect(userInDB?.username).to.equal('test2');

  });

  it('User deletion test', async () => {
    
    const user = await dbHandler.models.User.create({
      username: 'test',
      phonenumber: '123123123',
      email: 'test@test.com',
      birthdate: new Date(),
      rights: UserRights.Customer,
      lookupHash: 'testlonger',
      lookupNoise: 1
    });

    await user.destroy();

    const userInDB = await dbHandler.models.User.findByPk(user.id);

    expect(userInDB).to.not.exist;

  });

  it('User scopes test', async () => {
    
    const customer = await dbHandler.models.User.create({
      username: 'test',
      phonenumber: '123123123',
      email: 'test@test.com',
      birthdate: new Date(),
      rights: UserRights.Customer,
      lookupHash: 'testlonger',
      lookupNoise: 1
    });

    const appAdmin = await dbHandler.models.User.create({
      username: 'testAdmin',
      phonenumber: '1231231231',
      email: 'test@testAdmin.com',
      birthdate: new Date(),
      rights: UserRights.AppAdmin,
      lookupHash: 'testlonger1',
      lookupNoise: 2
    });

    const orgAdmin = await dbHandler.models.User.create({
      username: 'testOrgAdmin',
      phonenumber: '12312312329',
      email: 'test@testOrgAdmin.com',
      birthdate: new Date(),
      rights: UserRights.OrgAdmin,
      lookupHash: 'testlonger2',
      lookupNoise: 3
    });

    const manager = await dbHandler.models.User.create({
      username: 'testManager',
      phonenumber: '1231231232',
      email: 'test@testManager.com',
      birthdate: new Date(),
      rights: UserRights.Manager,
      lookupHash: 'testlonger29',
      lookupNoise: 3
    });

    const disabled = await dbHandler.models.User.create({
      username: 'testDisabled',
      phonenumber: '1231231233',
      email: 'test@testDisabled.com',
      birthdate: new Date(),
      rights: UserRights.Disabled,
      lookupHash: 'testlonger3',
      lookupNoise: 4
    });

    const userToDelete = await dbHandler.models.User.create({
      username: 'testDeletedAt',
      phonenumber: '1231231234',
      email: 'test@testDeletedAt.com',
      birthdate: new Date(),
      rights: UserRights.Customer,
      lookupHash: 'testlonger4',
      lookupNoise: 5
    });

    await userToDelete.destroy();

    const customerInDB = await dbHandler.models.User.scope('customer').findAll({});
    const appAdminInDB = await dbHandler.models.User.scope('appAdmin').findAll({});
    const orgAdminInDB = await dbHandler.models.User.scope('orgAdmin').findAll({});
    const managerInDB = await dbHandler.models.User.scope('manager').findAll({});
    const disabledInDB = await dbHandler.models.User.scope('disabled').findAll({});
    const deletedInDB = await dbHandler.models.User.scope('deleted').findAll({});
    const allUsersInDB = await dbHandler.models.User.scope('all').findAll({});

    expect(customerInDB).to.have.lengthOf(1);
    expect(customerInDB[0].id).to.equal(customer.id);

    expect(appAdminInDB).to.have.lengthOf(1);
    expect(appAdminInDB[0].id).to.equal(appAdmin.id);

    expect(orgAdminInDB).to.have.lengthOf(1);
    expect(orgAdminInDB[0].id).to.equal(orgAdmin.id);

    expect(managerInDB).to.have.lengthOf(1);
    expect(managerInDB[0].id).to.equal(manager.id);

    expect(disabledInDB).to.have.lengthOf(1);
    expect(disabledInDB[0].id).to.equal(disabled.id);

    expect(deletedInDB).to.have.lengthOf(1);
    expect(deletedInDB[0].id).to.equal(userToDelete.id);

    expect(allUsersInDB).to.have.lengthOf(6);

  });

  it('User default scope test: does not include timestamps', async () => {
    
    const user = await dbHandler.models.User.create({
      username: 'test',
      phonenumber: '123123123',
      email: 'test@test.com',
      birthdate: new Date(),
      rights: UserRights.Customer,
      lookupHash: 'testlonger',
      lookupNoise: 1
    });

    const userInDB = await dbHandler.models.User.scope('all').findByPk(user.id);

    expect(userInDB?.createdAt).to.not.exist;
    expect(userInDB?.updatedAt).to.not.exist;

  });

});