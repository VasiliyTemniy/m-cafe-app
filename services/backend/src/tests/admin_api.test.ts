import type { FixedLocDT, UiSettingDT, UserDT } from '@m-cafe-app/models';
import { expect } from 'chai';
import 'mocha';
import supertest from 'supertest';
import app from '../app';
import { apiBaseUrl } from './test_helper';
import { initLogin, userAgent } from './sessions_api_helper';
import { createUser, validNewUser, validUserInDB } from './user_api_helper';
import backendLogicConfig from '@m-cafe-app/backend-logic';
import { createAdmin, validAdminInDB } from './admin_api_helper';
import { authController, fixedLocService, sessionService, uiSettingService, userService } from '../controllers';
import { User as UserPG } from '@m-cafe-app/db';


const api = supertest(app);


describe('Superadmin special check', () => {

  before(async () => {
    await userService.removeAll();
    await userService.initSuperAdmin();
  });

  it('The super admin gets created, process envs with his \
password, username get zeroified, phonenumber left for distinguishing reasons', async () => {

    const adminUsers = await userService.getByScope('admin');

    expect(adminUsers).to.be.lengthOf(1);
    expect(adminUsers[0].rights).to.equal('admin');
    expect(adminUsers[0].phonenumber).to.exist;
    expect(adminUsers[0].username).to.exist;

    expect(process.env.SUPERADMIN_USERNAME).to.equal('');
    expect(process.env.SUPERADMIN_PASSWORD).to.equal('');

    expect(process.env.SUPERADMIN_PHONENUMBER).to.equal(backendLogicConfig.SUPERADMIN_PHONENUMBER);

  });

  it('Superadmin cannot login with phonenumber and password. Password is not even checked after phonenumber detection', async () => {

    const superadmin = await userService.userRepo.getByUniqueProperties({
      phonenumber: backendLogicConfig.SUPERADMIN_PHONENUMBER
    });

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

  let admin: UserDT;
  let customer: UserDT;

  beforeEach(async () => {
    const keepSuperAdmin = true;
    await userService.removeAll(keepSuperAdmin);

    admin = await createAdmin(validAdminInDB.dtn);
    customer = await createUser(validUserInDB.dtn);

    await sessionService.removeAll();

  });

  it('Admin can disable any user or give any user admin rights and vice versa', async () => {

    const tokenCookie1 = await initLogin(admin, validAdminInDB.password, api, 201, userAgent) as string;

    const response1 = await api
      .put(`${apiBaseUrl}/admin/user/${customer.id}`)
      .set('Cookie', [tokenCookie1])
      .set('User-Agent', userAgent)
      .send({ rights: 'admin' })
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response1.body.id).to.equal(customer.id);
    expect(response1.body.rights).to.equal('admin');

    const tokenCookie2 = await initLogin(customer, validUserInDB.password, api, 201, userAgent) as string;

    const response2 = await api
      .put(`${apiBaseUrl}/admin/user/${admin.id}`)
      .set('Cookie', [tokenCookie2])
      .set('User-Agent', userAgent)
      .send({ rights: 'customer' })
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response2.body.id).to.equal(admin.id);
    expect(response2.body.rights).to.equal('customer');

    const response3 = await api
      .put(`${apiBaseUrl}/admin/user/${admin.id}`)
      .set('Cookie', [tokenCookie2])
      .set('User-Agent', userAgent)
      .send({ rights: 'disabled' })
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const disabledUsers3 = await userService.getByScope('disabled');

    expect(disabledUsers3).to.be.lengthOf(1);
    expect(disabledUsers3[0].id).to.be.equal(admin.id);
    expect(disabledUsers3[0].id).to.be.equal(response3.body.id);

    await api
      .put(`${apiBaseUrl}/admin/user/${admin.id}`)
      .set('Cookie', [tokenCookie2])
      .set('User-Agent', userAgent)
      .send({ rights: 'customer' })
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const disabledUsers4 = await userService.getByScope('disabled');

    expect(disabledUsers4).to.be.lengthOf(0);

  });

  it('Nobody can change superadmin data or delete it, even other admins', async () => {

    const superadmin = await userService.userRepo.getByUniqueProperties({
      phonenumber: backendLogicConfig.SUPERADMIN_PHONENUMBER
    });

    if (!superadmin) expect(true).to.equal(false);

    const tokenCookie = await initLogin(admin, validAdminInDB.password, api, 201, userAgent) as string;

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

    const tokenCookie = await initLogin(customer, validUserInDB.password, api, 201, userAgent) as string;

    const response1 = await api
      .put(`${apiBaseUrl}/admin/user/${customer.id}`)
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
    const validUsersTokenCookie = await initLogin(customer, validUserInDB.password, api, 201, userAgent) as string;
    await initLogin(customer, validUserInDB.password, api, 201, 'CHROME');
    await initLogin(customer, validUserInDB.password, api, 201, 'FIREFOX');
    await initLogin(customer, validUserInDB.password, api, 201, 'ELINKS');

    const sessions = await sessionService.getAllByUserId(customer.id);

    expect(sessions).to.be.lengthOf(4);

    // Check that user's token is valid
    await api
      .get(`${apiBaseUrl}/user/me`)
      .set('Cookie', [validUsersTokenCookie])
      .set('User-Agent', userAgent)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    // Admin logs in
    const tokenCookie = await initLogin(admin, validAdminInDB.password, api, 201, userAgent) as string;

    // Admin disables the user
    await api
      .put(`${apiBaseUrl}/admin/user/${customer.id}`)
      .set('Cookie', [tokenCookie])
      .set('User-Agent', userAgent)
      .send({ rights: 'disabled' })
      .expect(200)
      .expect('Content-Type', /application\/json/);


    // User's sessions get deleted
    const validUserInDBSessions1 = await sessionService.getAllByUserId(customer.id);

    expect(validUserInDBSessions1).to.be.lengthOf(0);

    // The user tries to log in
    const response1 = await api
      .post(`${apiBaseUrl}/session`)
      .set('User-Agent', userAgent)
      .send({ username: customer.username, password: validAdminInDB.password })
      .expect(403)
      .expect('Content-Type', /application\/json/);

    expect(response1.body.error.name).to.equal('BannedError');
    expect(response1.body.error.message).to.equal('Your account have been banned. Contact admin to unblock account');

    const validUserInDBSessions2 = await sessionService.getAllByUserId(customer.id);

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
    const users = await userService.getByScope('customer');
    const bannedUser = users.find(user => user.id === customer.id);

    expect(bannedUser).to.not.exist;

    const bannedUsers = await userService.getByScope('disabled');

    expect(bannedUsers.length).to.be.greaterThan(0);

  });

  it('Admin cannot delete users if they did not try delete them themselves, i.e. without deletedAt notnull property', async () => {

    const tokenCookie = await initLogin(admin, validAdminInDB.password, api, 201, userAgent) as string;

    const response = await api
      .delete(`${apiBaseUrl}/admin/user/${customer.id}`)
      .set('Cookie', [tokenCookie])
      .set('User-Agent', userAgent)
      .expect(403)
      .expect('Content-Type', /application\/json/);

    expect(response.body.error.name).to.equal('ProhibitedError');
    expect(response.body.error.message).to.equal('Only voluntarily deleted users can be fully removed by admins');

  });

  it('Admin can delete users if they did try delete them themselves, i.e. with deletedAt notnull property', async () => {

    const tokenCookie1 = await initLogin(customer, validUserInDB.password, api, 201, userAgent) as string;

    await api
      .delete(`${apiBaseUrl}/user`)
      .set('Cookie', [tokenCookie1])
      .set('User-Agent', userAgent)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const tokenCookie2 = await initLogin(admin, validAdminInDB.password, api, 201, userAgent) as string;

    await api
      .delete(`${apiBaseUrl}/admin/user/${customer.id}`)
      .set('Cookie', [tokenCookie2])
      .set('User-Agent', userAgent)
      .expect(204);

    const deletedUsers = await userService.getByScope('deleted');
    expect(deletedUsers.length).to.equal(0);

  });

  it('Admin can restore users if they did try delete them themselves, i.e. with deletedAt notnull property, \
if they did not request to make permanent deletion', async () => {

    const tokenCookie1 = await initLogin(customer, validUserInDB.password, api, 201, userAgent) as string;

    await api
      .delete(`${apiBaseUrl}/user`)
      .set('Cookie', [tokenCookie1])
      .set('User-Agent', userAgent)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const tokenCookie2 = await initLogin(admin, validAdminInDB.password, api, 201, userAgent) as string;

    await api
      .put(`${apiBaseUrl}/admin/user/${customer.id}`)
      .set('Cookie', [tokenCookie2])
      .set('User-Agent', userAgent)
      .send({ restore: true })
      .expect(200);

    const restoredUser = await userService.getById(customer.id);
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
  
  // Superadmin password gets deleted from everywhere right after initSuperAdmin()
  // To keep other tests working, we need to keep 'realSuperadmin'
  // To test some things in this block, we need to be able to login as superadmin
  // So, we need to create a mock superadmin

  let validAdminTokenCookie: string;
  let mockSuperAdminTokenCookie: string;

  let realSuperadmin: UserPG;
  let mockSuperadmin: UserPG;

  before(async () => {
    const keepSuperAdmin = true;
    await userService.removeAll(keepSuperAdmin);

    realSuperadmin = await UserPG.findOne({
      where: {
        phonenumber: backendLogicConfig.SUPERADMIN_PHONENUMBER
      }
    }) as UserPG;

    realSuperadmin.phonenumber = '123456789';
    await realSuperadmin.save();

    // Directly create db entry for mock super admin. Does not create auth data in external service
    mockSuperadmin = await UserPG.create({
      ...validUserInDB.dtn,
      birthdate: new Date('2000-01-01'),
      rights: 'admin',
      phonenumber: backendLogicConfig.SUPERADMIN_PHONENUMBER,
      lookupHash: '123456789TEST'
    });

    // Create auth data in external service
    await authController.create({
      id: mockSuperadmin.id,
      lookupHash: mockSuperadmin.lookupHash,
      ttl: backendLogicConfig.TOKEN_TTL,
      password: validUserInDB.password
    });

    const admin = await createAdmin(validAdminInDB.dtn);

    await fixedLocService.removeAll();
    await uiSettingService.removeAll();

    validAdminTokenCookie = await initLogin(admin, validAdminInDB.password, api, 201, userAgent) as string;
    mockSuperAdminTokenCookie = await initLogin(
      {
        id: mockSuperadmin.id,
        username: mockSuperadmin.username,
        phonenumber: mockSuperadmin.phonenumber,
      },
      validUserInDB.password, api, 201, userAgent, true
    ) as string;
  });

  after(async () => {
    // Switch mock and real superadmin to their original phonenumber

    mockSuperadmin.phonenumber = '1234567891';
    await mockSuperadmin.save();

    realSuperadmin.phonenumber = backendLogicConfig.SUPERADMIN_PHONENUMBER;
    await realSuperadmin.save();

    const keepSuperAdmin = true;
    await userService.removeAll(keepSuperAdmin);

    await fixedLocService.removeAll();
  });

  it('Admin /fixed-loc/reset route works, can be used only by superadmin', async () => {

    const response1 = await api
      .get(`${apiBaseUrl}/admin/fixed-loc/reset`)
      .set('Cookie', [validAdminTokenCookie])
      .set('User-Agent', userAgent)
      .expect(403);

    expect(response1.body.error.name).to.equal('ProhibitedError');
    expect(response1.body.error.message).to.equal(`Please, call superadmin to resolve this problem ${backendLogicConfig.SUPERADMIN_PHONENUMBER}`);

    await fixedLocService.initFixedLocs('locales', 'jsonc');

    const fixedLocs = await fixedLocService.getAll();

    const randomFixedLoc = Math.floor(Math.random() * fixedLocs.length);

    const fixedLocToEdit = await fixedLocService.getById(fixedLocs[randomFixedLoc].id);
    if (!fixedLocToEdit) return expect(true).to.equal(false);

    fixedLocToEdit.scope = 'newScope';
    fixedLocToEdit.locString.mainStr = 'newMainStr';
    await fixedLocService.update(fixedLocToEdit);

    const response2 = await api
      .get(`${apiBaseUrl}/admin/fixed-loc/reset`)
      .set('Cookie', [mockSuperAdminTokenCookie])
      .set('User-Agent', userAgent)
      .expect(200);

    const responseFixedLocs = response2.body as FixedLocDT[];

    const resettedFixedLoc = responseFixedLocs.find(fixedLoc => fixedLoc.name === fixedLocs[randomFixedLoc].name);

    expect(resettedFixedLoc?.scope).to.not.equal(fixedLocToEdit.scope);
    expect(resettedFixedLoc?.locString?.mainStr).to.not.equal(fixedLocToEdit.locString.mainStr);
    
  });

  it('Admin /ui-setting/reset route works, can be used only by superadmin', async () => {
    
    const response1 = await api
      .get(`${apiBaseUrl}/admin/ui-setting/reset`)
      .set('Cookie', [validAdminTokenCookie])
      .set('User-Agent', userAgent)
      .expect(403);

    expect(response1.body.error.name).to.equal('ProhibitedError');
    expect(response1.body.error.message).to.equal(`Please, call superadmin to resolve this problem ${backendLogicConfig.SUPERADMIN_PHONENUMBER}`);

    await uiSettingService.initUiSettings();

    const uiSettings = await uiSettingService.getByScope('all');

    const randomUiSetting = Math.floor(Math.random() * uiSettings.length);

    const uiSettingToEdit = uiSettings[randomUiSetting];

    uiSettingToEdit.value = 'newAbsurdValue';

    await uiSettingService.update(uiSettingToEdit);

    const response2 = await api
      .get(`${apiBaseUrl}/admin/ui-setting/reset`)
      .set('Cookie', [mockSuperAdminTokenCookie])
      .set('User-Agent', userAgent)
      .expect(200);

    const resettedUiSettings = response2.body as UiSettingDT[];

    const resettedUiSetting = resettedUiSettings.find(uiSetting => uiSetting.name === uiSettings[randomUiSetting].name);

    expect(resettedUiSetting?.value).to.not.equal(uiSettingToEdit.value);
    
  });
});