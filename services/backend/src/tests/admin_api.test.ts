import { expect } from "chai";
import "mocha";
import supertest from 'supertest';
import app from "../app";
import { apiBaseUrl } from './test_helper';
import { connectToDatabase } from "../utils/db";
import { User, Session } from '../models/index';
import { initSuperAdmin } from "../utils/adminInit";
import { initLogin, userAgent } from "./sessions_api_helper";
import { initialUsers, validUserInDB } from './users_api_helper';
import config from "../utils/config";
import { validAdminInDB } from "./admin_api_helper";
import { Op } from "sequelize";



await connectToDatabase();
const api = supertest(app);


describe('Superadmin special check', () => {

  before(async () => {
    await User.destroy({ where: {} });
    await initSuperAdmin();
  });

  it('The super admin gets created, process envs with his \
password, username get zeroified, phonenumber left for distinguishing reasons', async () => {

    const adminUsers = await User.scope('admin').findAll({});

    expect(adminUsers).to.be.lengthOf(1);
    expect(adminUsers[0].admin).to.equal(true);
    expect(adminUsers[0].phonenumber).to.exist;
    expect(adminUsers[0].username).to.exist;
    expect(adminUsers[0].passwordHash).to.exist;

    expect(process.env.SUPERADMIN_USERNAME).to.equal('');
    expect(process.env.SUPERADMIN_PASSWORD).to.equal('');

    expect(process.env.SUPERADMIN_PHONENUMBER).to.equal(config.SUPERADMIN_PHONENUMBER);

  });

  it('Superadmin cannot login with phonenumber and password. Password is not even checked after phonenumber detection', async () => {

    const superadmin = await User.findOne({
      where: {
        phonenumber: config.SUPERADMIN_PHONENUMBER
      }
    }) as User;

    if (!superadmin) expect(true).to.equal(false);

    const response = await api
      .post(`${apiBaseUrl}/session`)
      .set('User-Agent', userAgent)
      .send({ phonenumber: superadmin.phonenumber, password: 'alreadyUnknownJustPutThisHereForCheck' })
      .expect(403)
      .expect('Content-Type', /application\/json/);

    expect(response.body.error.name).to.equal('ProhibitedError');
    expect(response.body.error.message).to.equal('Superadmin must login only with a username');

  });
});


describe('Admin router basics', () => {

  let validAdminInDBID: number;
  let validUserInDBID: number;

  before(async () => {
    await initSuperAdmin();
  });

  beforeEach(async () => {
    await User.scope('all').destroy({
      where: {
        phonenumber: {
          [Op.not]: config.SUPERADMIN_PHONENUMBER
        }
      }
    });

    await User.bulkCreate(initialUsers);
    const admin = await User.create(validAdminInDB.dbEntry);
    const user = await User.create(validUserInDB.dbEntry);

    validAdminInDBID = admin.id;
    validUserInDBID = user.id;

    await Session.destroy({ where: {} });

  });

  it('Admin can disable any user or give any user admin rights and vice versa', async () => {

    const token1 = await initLogin(validAdminInDB.dbEntry, validAdminInDB.password, api, 201, userAgent);

    const response1 = await api
      .put(`${apiBaseUrl}/admin/users/${validUserInDBID}`)
      .set({ Authorization: `bearer ${token1}` })
      .set('User-Agent', userAgent)
      .send({ admin: true })
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response1.body.id).to.equal(validUserInDBID);
    expect(response1.body.admin).to.equal(true);

    const token2 = await initLogin(validUserInDB.dbEntry, validUserInDB.password, api, 201, userAgent);

    const response2 = await api
      .put(`${apiBaseUrl}/admin/users/${validAdminInDBID}`)
      .set({ Authorization: `bearer ${token2}` })
      .set('User-Agent', userAgent)
      .send({ admin: false })
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response2.body.id).to.equal(validAdminInDBID);
    expect(response2.body.admin).to.equal(false);

    const response3 = await api
      .put(`${apiBaseUrl}/admin/users/${validAdminInDBID}`)
      .set({ Authorization: `bearer ${token2}` })
      .set('User-Agent', userAgent)
      .send({ disabled: true })
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const disabledUsers3 = await User.scope('disabled').findAll({});

    expect(disabledUsers3).to.be.lengthOf(1);
    expect(disabledUsers3[0].id).to.be.equal(validAdminInDBID);
    expect(disabledUsers3[0].id).to.be.equal(response3.body.id);

    await api
      .put(`${apiBaseUrl}/admin/users/${validAdminInDBID}`)
      .set({ Authorization: `bearer ${token2}` })
      .set('User-Agent', userAgent)
      .send({ disabled: false })
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const disabledUsers4 = await User.scope('disabled').findAll({});

    expect(disabledUsers4).to.be.lengthOf(0);

  });

  it('Nobody can change superadmin data or delete it, even other admins', async () => {

    const superadmin = await User.findOne({
      where: {
        phonenumber: config.SUPERADMIN_PHONENUMBER
      }
    }) as User;

    if (!superadmin) expect(true).to.equal(false);

    const token = await initLogin(validAdminInDB.dbEntry, validAdminInDB.password, api, 201, userAgent);

    const response = await api
      .put(`${apiBaseUrl}/admin/users/${superadmin.id}`)
      .set({ Authorization: `bearer ${token}` })
      .set('User-Agent', userAgent)
      .send({ admin: false, disabled: true })
      .expect(403)
      .expect('Content-Type', /application\/json/);

    expect(response.body.error.name).to.equal('ProhibitedError');
    expect(response.body.error.message).to.equal('Attempt to alter superadmin');

  });

  it('Common users are prohibited to use admin routes', async () => {

    const token = await initLogin(validUserInDB.dbEntry, validUserInDB.password, api, 201, userAgent);

    const response1 = await api
      .put(`${apiBaseUrl}/admin/users/${validUserInDBID}`)
      .set({ Authorization: `bearer ${token}` })
      .set('User-Agent', userAgent)
      .send({ admin: true })
      .expect(403)
      .expect('Content-Type', /application\/json/);

    expect(response1.body.error.name).to.equal('ProhibitedError');
    expect(response1.body.error.message).to.equal('You have no admin permissions');

    // Check admin route for getting user data
    const response2 = await api
      .get(`${apiBaseUrl}/admin/users/`)
      .set({ Authorization: `bearer ${token}` })
      .set('User-Agent', userAgent)
      .expect(403)
      .expect('Content-Type', /application\/json/);

    expect(response2.body.error.name).to.equal('ProhibitedError');
    expect(response2.body.error.message).to.equal('You have no admin permissions');

  });

  it('Disabled / banned users are prohibited to use the app, get appropriate message to contact admin. \
Also, all user sessions gets deleted after being banned. Also, user is not visible through default sequelize scope', async () => {

    // Some user logins thrice from different browsers
    const validUsersToken = await initLogin(validUserInDB.dbEntry, validUserInDB.password, api, 201, userAgent);
    await initLogin(validUserInDB.dbEntry, validUserInDB.password, api, 201, 'CHROME');
    await initLogin(validUserInDB.dbEntry, validUserInDB.password, api, 201, 'FIREFOX');
    await initLogin(validUserInDB.dbEntry, validUserInDB.password, api, 201, 'ELINKS');

    const sessions = await Session.findAll({});

    expect(sessions).to.be.lengthOf(4);

    // Check that user's token is valid
    await api
      .get(`${apiBaseUrl}/users/me`)
      .set({ Authorization: `bearer ${validUsersToken}` })
      .set('User-Agent', userAgent)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    // Admin logs in
    const token = await initLogin(validAdminInDB.dbEntry, validAdminInDB.password, api, 201, userAgent);

    // Admin disables the user
    await api
      .put(`${apiBaseUrl}/admin/users/${validUserInDBID}`)
      .set({ Authorization: `bearer ${token}` })
      .set('User-Agent', userAgent)
      .send({ disabled: true })
      .expect(200)
      .expect('Content-Type', /application\/json/);


    // User's sessions get deleted
    const validUserInDBSessions1 = await Session.findAll({ where: { userId: validUserInDBID } });

    expect(validUserInDBSessions1).to.be.lengthOf(0);

    // The user tries to log in
    const response1 = await api
      .post(`${apiBaseUrl}/session`)
      .set('User-Agent', userAgent)
      .send({ username: validUserInDB.dbEntry.username, password: validAdminInDB.password })
      .expect(403)
      .expect('Content-Type', /application\/json/);

    expect(response1.body.error.name).to.equal('BannedError');
    expect(response1.body.error.message).to.equal('Your account have been banned. Contact admin to unblock account');

    const validUserInDBSessions2 = await Session.findAll({ where: { userId: validUserInDBID } });

    expect(validUserInDBSessions2).to.be.lengthOf(0);

    // Check that user's previously valid token is now invalid
    const response2 = await api
      .get(`${apiBaseUrl}/users/me`)
      .set({ Authorization: `bearer ${validUsersToken}` })
      .set('User-Agent', userAgent)
      .expect(403)
      .expect('Content-Type', /application\/json/);

    expect(response2.body.error.name).to.equal('BannedError');
    expect(response2.body.error.message).to.equal('Your account have been banned. Contact admin to unblock account');

    // Scopes test
    const dbEntryOfBannedUser1 = await User.findAll({ where: { ...validUserInDB.dbEntry } });

    expect(dbEntryOfBannedUser1).to.be.lengthOf(0);

    const dbEntryOfBannedUser2 = await User.scope('all').findOne({ where: { ...validUserInDB.dbEntry } });

    expect(dbEntryOfBannedUser2).to.exist;

  });

});