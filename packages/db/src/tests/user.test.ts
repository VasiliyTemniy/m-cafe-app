import { expect } from 'chai';
import 'mocha';
import { connectToDatabase } from '../db';
import { User } from '../models';


await connectToDatabase();


describe('Database User model tests', () => {

  beforeEach(async () => {
    await User.scope('all').destroy({ force: true, where: {} });
  });

  after(async () => {
    await User.scope('all').destroy({ force: true, where: {} });
  });

  it('User сreation test', async () => {

    const user = await User.create({
      username: 'test',
      passwordHash: 'testlonger',
      phonenumber: '123123123',
      email: 'test@test.com',
      birthdate: new Date(),
      rights: 'customer'
    });

    expect(user).to.exist;

  });

  it('User update test', async () => {
    
    const user = await User.create({
      username: 'test',
      passwordHash: 'testlonger',
      phonenumber: '123123123',
      email: 'test@test.com',
      birthdate: new Date(),
      rights: 'customer'
    });

    user.username = 'test2';

    await user.save();

    const userInDB = await User.findByPk(user.id);

    expect(userInDB).to.exist;
    expect(userInDB?.username).to.equal('test2');

  });

  it('User deletion test', async () => {
    
    const user = await User.create({
      username: 'test',
      passwordHash: 'testlonger',
      phonenumber: '123123123',
      email: 'test@test.com',
      birthdate: new Date(),
      rights: 'customer'
    });

    await user.destroy();

    const userInDB = await User.findByPk(user.id);

    expect(userInDB).to.not.exist;

  });

  it('User scopes test', async () => {
    
    const customer = await User.create({
      username: 'test',
      passwordHash: 'testlonger',
      phonenumber: '123123123',
      email: 'test@test.com',
      birthdate: new Date(),
      rights: 'customer'
    });

    const admin = await User.create({
      username: 'testAdmin',
      passwordHash: 'testlonger',
      phonenumber: '1231231231',
      email: 'test@testAdmin.com',
      birthdate: new Date(),
      rights: 'admin'
    });

    const manager = await User.create({
      username: 'testManager',
      passwordHash: 'testlonger',
      phonenumber: '1231231232',
      email: 'test@testManager.com',
      birthdate: new Date(),
      rights: 'manager'
    });

    const disabled = await User.create({
      username: 'testDisabled',
      passwordHash: 'testlonger',
      phonenumber: '1231231233',
      email: 'test@testDisabled.com',
      birthdate: new Date(),
      rights: 'disabled'
    });

    const userToDelete = await User.create({
      username: 'testDeletedAt',
      passwordHash: 'testlonger',
      phonenumber: '1231231234',
      email: 'test@testDeletedAt.com',
      birthdate: new Date(),
      rights: 'customer'
    });

    await userToDelete.destroy();

    const customerInDB = await User.scope('customer').findAll({});
    const adminInDB = await User.scope('admin').findAll({});
    const managerInDB = await User.scope('manager').findAll({});
    const disabledInDB = await User.scope('disabled').findAll({});
    const deletedInDB = await User.scope('deleted').findAll({});
    const allUsersInDB = await User.scope('all').findAll({});

    expect(customerInDB).to.have.lengthOf(1);
    expect(customerInDB[0].id).to.equal(customer.id);

    expect(adminInDB).to.have.lengthOf(1);
    expect(adminInDB[0].id).to.equal(admin.id);

    expect(managerInDB).to.have.lengthOf(1);
    expect(managerInDB[0].id).to.equal(manager.id);

    expect(disabledInDB).to.have.lengthOf(1);
    expect(disabledInDB[0].id).to.equal(disabled.id);

    expect(deletedInDB).to.have.lengthOf(1);
    expect(deletedInDB[0].id).to.equal(userToDelete.id);

    expect(allUsersInDB).to.have.lengthOf(5);

  });

  it('User default scope test: does not include timestamps', async () => {
    
    const user = await User.create({
      username: 'test',
      passwordHash: 'testlonger',
      phonenumber: '123123123',
      email: 'test@test.com',
      birthdate: new Date(),
      rights: 'customer'
    });

    const userInDB = await User.scope('all').findByPk(user.id);

    expect(userInDB?.createdAt).to.not.exist;
    expect(userInDB?.updatedAt).to.not.exist;

  });

});