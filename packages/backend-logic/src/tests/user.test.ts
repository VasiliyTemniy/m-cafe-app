import type { UserDTU } from '@m-cafe-app/models';
import { expect } from 'chai';
import 'mocha';
import { authServiceExternalGRPC } from '../external';
// import logger from '../utils/logger';
import { UserRepoSequelizePG, UserService } from '../models/User';
import { SessionRepoRedis, SessionService } from '../models/Session';
import { AuthControllerInternal, AuthServiceInternal } from '../models/Auth';
import { connectToDatabase } from '@m-cafe-app/db';
import { initialUsers, newUserInfo } from './user_helper';



// No mocking, no unit testing for this package. Only integration tests ->
// If tests fail after dependency injection, change dependencies accordingly
// in these tests
const userService = new UserService(
  new UserRepoSequelizePG(),
  new SessionService(
    new SessionRepoRedis()
  ),
  new AuthControllerInternal(
    authServiceExternalGRPC,
    new AuthServiceInternal()
  )
);

describe('UserService implementation tests', () => {

  before(async () => {
    await userService.sessionService.connect();
    await connectToDatabase();
  });
  
  beforeEach(async () => {
    await userService.authController.flushExternalDB();
    await userService.removeAll();
    await userService.sessionService.removeAll();
  });
  
  it('should create user', async () => {
    const { user, auth } = await userService.create(newUserInfo, 'test');

    expect(user.email).to.equal('test@test.test');
    expect(user.username).to.equal('test');
    expect(user.phonenumber).to.equal('8988123456');

    expect(auth.id).to.equal(user.id);
    expect(auth.token).to.exist;
    expect(auth.token).to.not.equal('');
    expect(auth.error).to.equal('');

  });

  it('should authenticate user with correct password provided', async () => {
    const { user } = await userService.create(newUserInfo, 'test');

    const { auth } = await userService.authenticate(newUserInfo.password, { phonenumber: user.phonenumber, email: user.email });

    expect(auth.id).to.equal(user.id);
    expect(auth.token).to.exist;
    expect(auth.token).to.not.equal('');
    expect(auth.error).to.equal('');
  });

  it('should prevent authentication for user with incorrect password provided', async () => {
    const { user } = await userService.create(newUserInfo, 'test');

    try {
      await userService.authenticate('wrongPassword', { phonenumber: user.phonenumber, email: user.email });
    } catch (e) {
      if (!(e instanceof Error)) return expect(true).to.equal(false);
      expect(e.name).to.equal('AuthServiceError');
      expect(e.message).to.equal('invalid password');
    }
  });

  it('should update user', async () => {

    const { user } = await userService.create(newUserInfo, 'test');

    const userInfoToUpdate: UserDTU = {
      id: user.id,
      phonenumber: user.phonenumber,
      username: user.username,
      name: 'updatedName',
      email: 'newTest@test.test',
      birthdate: user.birthdate,
      password: newUserInfo.password
    };

    const { user: updatedUser, auth } = await userService.update(userInfoToUpdate, 'test');

    expect(updatedUser.email).to.equal('newTest@test.test');
    expect(updatedUser.name).to.equal('updatedName');
    expect(updatedUser.phonenumber).to.equal(user.phonenumber);

    expect(auth.id).to.equal(user.id);
    expect(auth.token).to.exist;
    expect(auth.token).to.not.equal('');
    expect(auth.error).to.equal('');

  });

  it('should update user password', async () => {

    const { user } = await userService.create(newUserInfo, 'test');

    const userInfoToUpdate: UserDTU = {
      id: user.id,
      phonenumber: user.phonenumber,
      username: user.username,
      name: 'updatedName',
      email: 'newTest@test.test',
      birthdate: user.birthdate,
      password: newUserInfo.password,
      newPassword: 'updatedPassword123'
    };

    const { user: updatedUser, auth } = await userService.update(userInfoToUpdate, 'test');

    expect(updatedUser.email).to.equal('newTest@test.test');
    expect(updatedUser.name).to.equal('updatedName');
    expect(updatedUser.phonenumber).to.equal(user.phonenumber);

    expect(auth.id).to.equal(user.id);
    expect(auth.token).to.exist;
    expect(auth.token).to.not.equal('');
    expect(auth.error).to.equal('');
  });

  it('should delete user', async () => {

    const { user } = await userService.create(newUserInfo, 'test');

    try {
      await userService.delete(user.id);
    } catch (e) {
      if (!(e instanceof Error)) return expect(true).to.equal(false);
      expect(e.name).to.equal('ProhibitedError');
      expect(e.message).to.equal('Only voluntarily deleted users can be fully removed by admins');
    }

    await userService.remove(user.id);

    const userAfterRemoval = await userService.getById(user.id);

    expect(userAfterRemoval.deletedAt).to.exist;

    await userService.delete(user.id);

    try {
      await userService.getById(user.id);
    } catch (e) {
      if (!(e instanceof Error)) return expect(true).to.equal(false);
      expect(e.name).to.equal('DatabaseError');
      expect(e.message).to.equal(`No user entry with this id ${user.id}`);
    }

  });

  it('should restore user', async () => {
    
    const { user } = await userService.create(newUserInfo, 'test');

    await userService.remove(user.id);

    await userService.administrate(user.id, { restore: true });

    const userAfterRestoration = await userService.getById(user.id);

    expect(userAfterRestoration.deletedAt).to.not.exist;
  });

  it('should get all users, get some users, get users by scope', async () => {
    
    for (const newUser of initialUsers) {
      await userService.create(newUser, 'test');
    }

    const users = await userService.getAll();

    expect(users.length).to.equal(initialUsers.length);

    const someUsers = await userService.getSome(3, 5);

    expect(someUsers.length).to.equal(3);
    expect(someUsers[0].username).to.equal(initialUsers[5].username);

    const userWithAdminRights = await userService.administrate(users[0].id, { rights: 'admin' });
    const userWithManagerRights = await userService.administrate(users[1].id, { rights: 'manager' });
    const disabledUser = await userService.administrate(users[2].id, { rights: 'disabled' });
    const deletedUser = await userService.remove(users[3].id);

    const customers = await userService.getByScope('customer');

    expect(customers.length).to.equal(users.length - 4);

    const admins = await userService.getByScope('admin');

    expect(admins.length).to.equal(1);
    expect(admins[0].phonenumber).to.equal(userWithAdminRights.phonenumber);

    const managers = await userService.getByScope('manager');

    expect(managers.length).to.equal(1);
    expect(managers[0].phonenumber).to.equal(userWithManagerRights.phonenumber);

    const disabledUsers = await userService.getByScope('disabled');

    expect(disabledUsers.length).to.equal(1);
    expect(disabledUsers[0].phonenumber).to.equal(disabledUser.phonenumber);

    const deletedUsers = await userService.getByScope('deleted');

    expect(deletedUsers.length).to.equal(1);
    expect(deletedUsers[0].phonenumber).to.equal(deletedUser.phonenumber);

    const allWithTimestamps = await userService.getByScope('allWithTimestamps');

    expect(allWithTimestamps.length).to.equal(users.length);
    expect(allWithTimestamps[0].createdAt).to.exist;

  });

});