import type { EditUiSettingBody, NewUiSettingBody } from '@m-cafe-app/utils';
import { timestampsKeys } from '@m-cafe-app/shared-constants';
import { expect } from 'chai';
import 'mocha';
import supertest from 'supertest';
import app from '../app';
import { connectToDatabase, UiSetting, User } from '@m-cafe-app/db';
import config from '../utils/config';
import { validAdminInDB } from './admin_api_helper';
import { Op } from 'sequelize';
import { Session } from '../redis/Session';
import { initLogin, userAgent } from './sessions_api_helper';
import { apiBaseUrl } from './test_helper';
import { validUserInDB } from './user_api_helper';
import { initUiSettings } from '../utils/initUiSettings';



await connectToDatabase();
const api = supertest(app);


describe('UiSetting requests tests', () => {

  let tokenCookie: string;
  let uiSettings: UiSetting[];

  before(async () => {
    await User.scope('all').destroy({
      force: true,
      where: {
        phonenumber: {
          [Op.not]: config.SUPERADMIN_PHONENUMBER
        }
      }
    });

    await User.create(validAdminInDB.dbEntry);
    await Session.destroy({ where: {} });
    tokenCookie = await initLogin(validAdminInDB.dbEntry, validAdminInDB.password, api, 201, userAgent) as string;

    await UiSetting.scope('all').destroy({ where: {} });

    await initUiSettings();
    uiSettings = await UiSetting.scope('all').findAll({});
  });

  it('UiSetting GET routes work without authorization and give only non-falsy uiSettings', async () => {

    const nonFalsyUiSettings = uiSettings.filter(uiSetting => uiSetting.dataValues.value !== 'false');

    const response1 = await api
      .get(`${apiBaseUrl}/ui-setting/${nonFalsyUiSettings[0].id}`)
      .set('User-Agent', userAgent)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const uiSettingInDB = await UiSetting.scope('all').findByPk(nonFalsyUiSettings[0].id);

    expect(response1.body.name).to.equal(uiSettingInDB?.name);
    expect(response1.body.value).to.equal(uiSettingInDB?.value);

    const response2 = await api
      .get(`${apiBaseUrl}/ui-setting`)
      .set('User-Agent', userAgent)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response2.body).to.be.lengthOf(nonFalsyUiSettings.length);
    expect(response2.body.length).to.be.lessThan(uiSettings.length);

  });

  it('UiSetting GET routes give all uiSettings including falsy if logged user is admin', async () => {

    const response1 = await api
      .get(`${apiBaseUrl}/ui-setting/${uiSettings[0].id}`)
      .set('Cookie', [tokenCookie])
      .set('User-Agent', userAgent)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const uiSettingInDB = await UiSetting.scope('all').findByPk(uiSettings[0].id);

    expect(response1.body.name).to.equal(uiSettingInDB?.name);
    expect(response1.body.value).to.equal(uiSettingInDB?.value);

    const response2 = await api
      .get(`${apiBaseUrl}/ui-setting`)
      .set('Cookie', [tokenCookie])
      .set('User-Agent', userAgent)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response2.body).to.be.lengthOf(uiSettings.length);

  });

  it('UiSetting POST, PUT, DELETE routes require admin rights', async () => {

    const response1 = await api
      .delete(`${apiBaseUrl}/ui-setting/${uiSettings[0].id}`)
      .set('User-Agent', userAgent)
      .expect(401)
      .expect('Content-Type', /application\/json/);

    expect(response1.body.error.name).to.equal('AuthorizationError');

    await User.create(validUserInDB.dbEntry);

    const commonUserTokenCookie = await initLogin(validUserInDB.dbEntry, validUserInDB.password, api, 201, userAgent) as string; 

    // const response2 = await api
    //   .delete(`${apiBaseUrl}/ui-setting/${uiSettings[0].id}`)
    //   .set('Cookie', [commonUserTokenCookie])
    //   .set('User-Agent', userAgent)
    //   .expect(403)
    //   .expect('Content-Type', /application\/json/);

    // expect(response2.body.error.name).to.equal('ProhibitedError');

    const response3 = await api
      .post(`${apiBaseUrl}/ui-setting`)
      .set('Cookie', [commonUserTokenCookie])
      .set('User-Agent', userAgent)
      .send({ some: 'crap' })
      .expect(403)
      .expect('Content-Type', /application\/json/);

    expect(response3.body.error.name).to.equal('ProhibitedError');

    const response4 = await api
      .put(`${apiBaseUrl}/ui-setting/${uiSettings[0].id}`)
      .set('Cookie', [commonUserTokenCookie])
      .set('User-Agent', userAgent)
      .send({ some: 'crap' })
      .expect(403)
      .expect('Content-Type', /application\/json/);

    expect(response4.body.error.name).to.equal('ProhibitedError');

  });

  it('UiSetting POST / adds new uiSetting, can be used by admin', async () => {

    const newUiSetting: NewUiSettingBody = {
      name: 'test',
      value: 'testValue',
      theme: 'light',
      group: 'input',
    };

    const response = await api
      .post(`${apiBaseUrl}/ui-setting`)
      .set('Cookie', [tokenCookie])
      .set('User-Agent', userAgent)
      .send(newUiSetting)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    expect(response.body.name).to.equal(newUiSetting.name);
    expect(response.body.value).to.equal(newUiSetting.value);

  });

  it('UiSetting PUT /:id updates uiSetting data, can be used by admin', async () => {

    const updUiSetting: EditUiSettingBody = {
      name: 'editTest', // ui settings names must be unmutable, so the name does not get changed even if put for correct ui setting id
      value: 'editTestValue',
      theme: 'light',
      group: 'input',
    };

    const response = await api
      .put(`${apiBaseUrl}/ui-setting/${uiSettings[0].id}`)
      .set('Cookie', [tokenCookie])
      .set('User-Agent', userAgent)
      .send(updUiSetting)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const updUiSettingInDB = await UiSetting.findByPk(uiSettings[0].id, {
      attributes: {
        exclude: [...timestampsKeys]
      }
    });

    expect(response.body.name).to.not.equal(updUiSetting.name);
    expect(response.body.name).to.equal(uiSettings[0].name);
    expect(response.body.value).to.equal(updUiSetting.value);


    expect(updUiSettingInDB?.name).to.not.equal(updUiSetting.name);
    expect(updUiSettingInDB?.name).to.equal(uiSettings[0].name);
    expect(updUiSettingInDB?.value).to.equal(updUiSetting.value);

  });

  // it('UiSetting DELETE /:id deletes uiSetting, can be used by admin', async () => {

  //   await api
  //     .delete(`${apiBaseUrl}/ui-setting/${uiSettings[0].id}`)
  //     .set('Cookie', [tokenCookie])
  //     .set('User-Agent', userAgent)
  //     .expect(204);

  // });

});