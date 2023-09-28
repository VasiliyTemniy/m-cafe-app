import { expect } from 'chai';
import 'mocha';
import supertest from 'supertest';
import app from '../app';
import { apiBaseUrl } from './test_helper';
import { connectToDatabase, FixedLoc, LocString, User } from '@m-cafe-app/db';
import { Session } from '../redis/Session';
import { initSuperAdmin } from '../utils/adminInit';
import { initLogin, userAgent } from './sessions_api_helper';
import { initialUsers, validNewUser, validUserInDB } from './user_api_helper';
import config from '../utils/config';
import { validAdminInDB } from './admin_api_helper';
import { Op } from 'sequelize';
import { initFixedLocs } from '../utils/initFixedLocs';



await connectToDatabase();
const api = supertest(app);


describe('Superadmin special check', () => {

  before(async () => {
    await User.scope('all').destroy({ force: true, where: {} });
    await initSuperAdmin();
  });

  it('The super admin gets created, process envs with his \
password, username get zeroified, phonenumber left for distinguishing reasons', async () => {

    const adminUsers = await User.scope('admin').findAll({});

    expect(adminUsers).to.be.lengthOf(1);
    expect(adminUsers[0].rights).to.equal('admin');
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

  beforeEach(async () => {
    await User.scope('all').destroy({
      force: true,
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

    const tokenCookie1 = await initLogin(validAdminInDB.dbEntry, validAdminInDB.password, api, 201, userAgent) as string;

    const response1 = await api
      .put(`${apiBaseUrl}/admin/user/${validUserInDBID}`)
      .set('Cookie', [tokenCookie1])
      .set('User-Agent', userAgent)
      .send({ rights: 'admin' })
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response1.body.id).to.equal(validUserInDBID);
    expect(response1.body.rights).to.equal('admin');

    const tokenCookie2 = await initLogin(validUserInDB.dbEntry, validUserInDB.password, api, 201, userAgent) as string;

    const response2 = await api
      .put(`${apiBaseUrl}/admin/user/${validAdminInDBID}`)
      .set('Cookie', [tokenCookie2])
      .set('User-Agent', userAgent)
      .send({ rights: 'user' })
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response2.body.id).to.equal(validAdminInDBID);
    expect(response2.body.rights).to.equal('user');

    const response3 = await api
      .put(`${apiBaseUrl}/admin/user/${validAdminInDBID}`)
      .set('Cookie', [tokenCookie2])
      .set('User-Agent', userAgent)
      .send({ rights: 'disabled' })
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const disabledUsers3 = await User.scope('disabled').findAll({});

    expect(disabledUsers3).to.be.lengthOf(1);
    expect(disabledUsers3[0].id).to.be.equal(validAdminInDBID);
    expect(disabledUsers3[0].id).to.be.equal(response3.body.id);

    await api
      .put(`${apiBaseUrl}/admin/user/${validAdminInDBID}`)
      .set('Cookie', [tokenCookie2])
      .set('User-Agent', userAgent)
      .send({ rights: 'user' })
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

    const tokenCookie = await initLogin(validAdminInDB.dbEntry, validAdminInDB.password, api, 201, userAgent) as string;

    const response = await api
      .put(`${apiBaseUrl}/admin/user/${superadmin.id}`)
      .set('Cookie', [tokenCookie])
      .set('User-Agent', userAgent)
      .send({ rights: 'disabled' })
      .expect(403)
      .expect('Content-Type', /application\/json/);

    expect(response.body.error.name).to.equal('ProhibitedError');
    expect(response.body.error.message).to.equal('Attempt to alter superadmin');

  });

  it('Common users are prohibited to use admin routes', async () => {

    const tokenCookie = await initLogin(validUserInDB.dbEntry, validUserInDB.password, api, 201, userAgent) as string;

    const response1 = await api
      .put(`${apiBaseUrl}/admin/user/${validUserInDBID}`)
      .set('Cookie', [tokenCookie])
      .set('User-Agent', userAgent)
      .send({ admin: true })
      .expect(403)
      .expect('Content-Type', /application\/json/);

    expect(response1.body.error.name).to.equal('ProhibitedError');
    expect(response1.body.error.message).to.equal('You have no admin permissions');

    // Check admin route for getting user data
    const response2 = await api
      .get(`${apiBaseUrl}/admin/user/`)
      .set('Cookie', [tokenCookie])
      .set('User-Agent', userAgent)
      .expect(403)
      .expect('Content-Type', /application\/json/);

    expect(response2.body.error.name).to.equal('ProhibitedError');
    expect(response2.body.error.message).to.equal('You have no admin permissions');

  });

  it('Disabled / banned users are prohibited to use the app, get appropriate message to contact admin. \
Also, all user sessions get deleted after user being banned. Also, user is not visible through default sequelize scope', async () => {

    // Some user logins thrice from different browsers
    const validUsersTokenCookie = await initLogin(validUserInDB.dbEntry, validUserInDB.password, api, 201, userAgent) as string;
    await initLogin(validUserInDB.dbEntry, validUserInDB.password, api, 201, 'CHROME');
    await initLogin(validUserInDB.dbEntry, validUserInDB.password, api, 201, 'FIREFOX');
    await initLogin(validUserInDB.dbEntry, validUserInDB.password, api, 201, 'ELINKS');

    const sessions = await Session.findAll({ where: { userId: validUserInDBID } });

    expect(sessions).to.be.lengthOf(4);

    // Check that user's token is valid
    await api
      .get(`${apiBaseUrl}/user/me`)
      .set('Cookie', [validUsersTokenCookie])
      .set('User-Agent', userAgent)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    // Admin logs in
    const tokenCookie = await initLogin(validAdminInDB.dbEntry, validAdminInDB.password, api, 201, userAgent) as string;

    // Admin disables the user
    await api
      .put(`${apiBaseUrl}/admin/user/${validUserInDBID}`)
      .set('Cookie', [tokenCookie])
      .set('User-Agent', userAgent)
      .send({ rights: 'disabled' })
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
      .get(`${apiBaseUrl}/user/me`)
      .set('Cookie', [validUsersTokenCookie])
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

  it('Admin cannot delete users if they did not try delete them themselves, i.e. without deletedAt notnull property', async () => {

    const tokenCookie = await initLogin(validAdminInDB.dbEntry, validAdminInDB.password, api, 201, userAgent) as string;

    const response = await api
      .delete(`${apiBaseUrl}/admin/user/${validUserInDBID}`)
      .set('Cookie', [tokenCookie])
      .set('User-Agent', userAgent)
      .expect(403)
      .expect('Content-Type', /application\/json/);

    expect(response.body.error.name).to.equal('ProhibitedError');
    expect(response.body.error.message).to.equal('Only voluntarily deleted users can be fully removed by admins');

  });

  it('Admin can delete users if they did try delete them themselves, i.e. with deletedAt notnull property', async () => {

    const tokenCookie1 = await initLogin(validUserInDB.dbEntry, validUserInDB.password, api, 201, userAgent) as string;

    await api
      .delete(`${apiBaseUrl}/user`)
      .set('Cookie', [tokenCookie1])
      .set('User-Agent', userAgent)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const tokenCookie2 = await initLogin(validAdminInDB.dbEntry, validAdminInDB.password, api, 201, userAgent) as string;

    await api
      .delete(`${apiBaseUrl}/admin/user/${validUserInDBID}`)
      .set('Cookie', [tokenCookie2])
      .set('User-Agent', userAgent)
      .expect(204);

    const deletedUser = await User.findByPk(validUserInDBID, { paranoid: false });
    expect(!deletedUser).to.equal(true);

  });

  it('Admin can restore users if they did try delete them themselves, i.e. with deletedAt notnull property, \
if they did not request to make permanent deletion', async () => {

    const tokenCookie1 = await initLogin(validUserInDB.dbEntry, validUserInDB.password, api, 201, userAgent) as string;

    await api
      .delete(`${apiBaseUrl}/user`)
      .set('Cookie', [tokenCookie1])
      .set('User-Agent', userAgent)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const tokenCookie2 = await initLogin(validAdminInDB.dbEntry, validAdminInDB.password, api, 201, userAgent) as string;

    await api
      .put(`${apiBaseUrl}/admin/user/${validUserInDBID}`)
      .set('Cookie', [tokenCookie2])
      .set('User-Agent', userAgent)
      .send({ restore: true })
      .expect(200);

    const restoredUser = await User.findByPk(validUserInDBID);
    if (!restoredUser) return expect(true).to.equal(false);

    expect(!restoredUser.deletedAt).to.equal(true);

  });

  it('New users cannot assign themselves admin role', async () => {

    const newUserTriesToBeAdmin = {
      ...validNewUser,
      rights: 'admin'
    };

    expect(newUserTriesToBeAdmin.rights).to.equal('admin');

    const response = await api
      .post(`${apiBaseUrl}/user`)
      .send(newUserTriesToBeAdmin)
      .expect(418)
      .expect('Content-Type', /application\/json/);

    expect(response.body.error.name).to.equal('HackError');
    expect(response.body.error.message).to.equal('Please do not try this');

  });

});


describe('Superadmin routes tests', () => {
  
  let validAdminTokenCookie: string;
  let mockSuperAdminTokenCookie: string;

  let realSuperadmin: User;
  let mockSuperadmin: User;

  before(async () => {
    await User.scope('all').destroy({
      force: true,
      where: {
        phonenumber: {
          [Op.not]: config.SUPERADMIN_PHONENUMBER
        }
      }
    });

    realSuperadmin = await User.findOne({
      where: {
        phonenumber: config.SUPERADMIN_PHONENUMBER
      }
    }) as User;

    realSuperadmin.phonenumber = '123456789';
    await realSuperadmin.save();

    mockSuperadmin = await User.create({
      ...validUserInDB.dbEntry,
      rights: 'admin',
      phonenumber: config.SUPERADMIN_PHONENUMBER
    });

    const admin = await User.create(validAdminInDB.dbEntry);

    await FixedLoc.destroy({ force: true, where: {} });

    validAdminTokenCookie = await initLogin(admin, validAdminInDB.password, api, 201, userAgent) as string;
    mockSuperAdminTokenCookie = await initLogin(mockSuperadmin, validUserInDB.password, api, 201, userAgent, true) as string;
  });

  after(async () => {
    mockSuperadmin.phonenumber = '1234567891';
    await mockSuperadmin.save();

    realSuperadmin.phonenumber = config.SUPERADMIN_PHONENUMBER;
    await realSuperadmin.save();

    await User.scope('all').destroy({
      force: true,
      where: {
        phonenumber: {
          [Op.not]: config.SUPERADMIN_PHONENUMBER
        }
      }
    });

    await FixedLoc.destroy({ force: true, where: {} });
  });

  it('Admin /fixed-loc/reset route works, can be used only by superadmin', async () => {

    const response1 = await api
      .get(`${apiBaseUrl}/admin/fixed-loc/reset`)
      .set('Cookie', [validAdminTokenCookie])
      .set('User-Agent', userAgent)
      .expect(403);

    expect(response1.body.error.name).to.equal('ProhibitedError');
    expect(response1.body.error.message).to.equal(`Please, call superadmin to resolve this problem ${config.SUPERADMIN_PHONENUMBER}`);

    await initFixedLocs();

    const fixedLocs = await FixedLoc.findAll({});

    const randomFixedLocId = Math.floor(Math.random() * fixedLocs.length);

    const fixedLocToEdit = await FixedLoc.findByPk(fixedLocs[randomFixedLocId].id);
    if (!fixedLocToEdit) return expect(true).to.equal(false);

    fixedLocToEdit.name = 'newName';
    await fixedLocToEdit.save();

    const locStringToEdit = await LocString.findByPk(fixedLocs[randomFixedLocId].locStringId);
    if (!locStringToEdit) return expect(true).to.equal(false);

    locStringToEdit.mainStr = 'newMainStr';
    await locStringToEdit.save();


    const response2 = await api
      .get(`${apiBaseUrl}/admin/fixed-loc/reset`)
      .set('Cookie', [mockSuperAdminTokenCookie])
      .set('User-Agent', userAgent)
      .expect(200);

    const responseFixedLocs = response2.body as FixedLoc[];

    const resettedFixedLoc = responseFixedLocs.find(fixedLoc => fixedLoc.id === fixedLocs[randomFixedLocId].id);

    expect(resettedFixedLoc?.name).to.not.equal('newName');
    expect(resettedFixedLoc?.locString?.mainStr).to.not.equal('newMainStr');
    
  });
});