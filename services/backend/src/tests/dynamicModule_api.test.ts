import type { EditDynamicModuleBody, NewDynamicModuleBody } from '@m-cafe-app/utils';
import { timestampsKeys } from '@m-cafe-app/utils';
import { expect } from 'chai';
import 'mocha';
import supertest from 'supertest';
import app from '../app';
import {
  connectToDatabase,
  DynamicModule,
  LocString,
  Picture,
  User
} from '@m-cafe-app/db';
import config from '../utils/config';
import { validAdminInDB } from './admin_api_helper';
import { Op } from 'sequelize';
import { Session } from '../redis/Session';
import { initLogin, userAgent } from './sessions_api_helper';
import { apiBaseUrl } from './test_helper';
import { validUserInDB } from './user_api_helper';
import {
  includeAltTextLocNoTimestamps,
  includeLocStringNoTimestamps,
} from '../utils/sequelizeHelpers';
import { initDynamicModules } from './dynamicModule_api_helper';



await connectToDatabase();
const api = supertest(app);


describe('DynamicModule requests tests', () => {

  let tokenCookie: string;
  let dynamicModules: DynamicModule[];

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

    await LocString.destroy({ where: {} });
    await DynamicModule.destroy({ where: {} });

    dynamicModules = await initDynamicModules();
  });

  it('DynamicModule GET routes work without authorization', async () => {

    const response1 = await api
      .get(`${apiBaseUrl}/dynamic-module/${dynamicModules[0].id}`)
      .set('User-Agent', userAgent)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const dynamicModuleInDB = await DynamicModule.findByPk(dynamicModules[0].id, {
      attributes: {
        exclude: [...timestampsKeys]
      },
      include: [
        {
          model: Picture,
          as: 'picture',
          required: false,
          attributes: {
            exclude: [...timestampsKeys]
          },
          include: [
            includeAltTextLocNoTimestamps
          ]
        },
        includeLocStringNoTimestamps
      ]
    });

    if (dynamicModuleInDB?.locString) expect(response1.body.locString?.id).to.equal(dynamicModuleInDB?.locString.id);
    if (dynamicModuleInDB?.locString) expect(response1.body.locString?.mainStr).to.equal(dynamicModuleInDB?.locString.mainStr);
    expect(response1.body.moduleType).to.equal(dynamicModuleInDB?.moduleType);
    expect(response1.body.page).to.equal(dynamicModuleInDB?.page);
    expect(response1.body.placement).to.equal(dynamicModuleInDB?.placement);
    expect(response1.body.placementType).to.equal(dynamicModuleInDB?.placementType);
    if (dynamicModuleInDB?.className) expect(response1.body.className).to.equal(dynamicModuleInDB?.className);
    if (dynamicModuleInDB?.url) expect(response1.body.url).to.equal(dynamicModuleInDB?.url);
    if (dynamicModuleInDB?.inlineCss) expect(response1.body.inlineCss).to.equal(dynamicModuleInDB?.inlineCss);


    const response2 = await api
      .get(`${apiBaseUrl}/dynamic-module`)
      .set('User-Agent', userAgent)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response2.body).to.be.lengthOf(dynamicModules.length);

  });

  it('DynamicModule POST, PUT, DELETE routes require admin rights', async () => {

    const response1 = await api
      .delete(`${apiBaseUrl}/dynamic-module/${dynamicModules[0].id}`)
      .set('User-Agent', userAgent)
      .expect(401)
      .expect('Content-Type', /application\/json/);

    expect(response1.body.error.name).to.equal('AuthorizationError');

    await User.create(validUserInDB.dbEntry);

    const commonUserTokenCookie = await initLogin(validUserInDB.dbEntry, validUserInDB.password, api, 201, userAgent) as string; 

    const response2 = await api
      .delete(`${apiBaseUrl}/dynamic-module/${dynamicModules[0].id}`)
      .set('Cookie', [commonUserTokenCookie])
      .set('User-Agent', userAgent)
      .expect(403)
      .expect('Content-Type', /application\/json/);

    expect(response2.body.error.name).to.equal('ProhibitedError');

    const response3 = await api
      .post(`${apiBaseUrl}/dynamic-module`)
      .set('Cookie', [commonUserTokenCookie])
      .set('User-Agent', userAgent)
      .send({ some: 'crap' })
      .expect(403)
      .expect('Content-Type', /application\/json/);

    expect(response3.body.error.name).to.equal('ProhibitedError');

    const response4 = await api
      .put(`${apiBaseUrl}/dynamic-module/${dynamicModules[0].id}`)
      .set('Cookie', [commonUserTokenCookie])
      .set('User-Agent', userAgent)
      .send({ some: 'crap' })
      .expect(403)
      .expect('Content-Type', /application\/json/);

    expect(response4.body.error.name).to.equal('ProhibitedError');

  });

  it('DynamicModule POST / adds new dynamicModule, can be used by admin', async () => {

    const newDynamicModule: NewDynamicModuleBody = {
      moduleType: 'cart',
      page: 'all',
      placement: 2,
      placementType: 'headerRight',
      className: 'some-class-for-header-right-side',
      inlineCss: '{ any valid inline CSS as JSON string }',
      locString: {
        mainStr: 'Корзина',
        secStr: 'Cart'
      }
    };

    const response = await api
      .post(`${apiBaseUrl}/dynamic-module`)
      .set('Cookie', [tokenCookie])
      .set('User-Agent', userAgent)
      .send(newDynamicModule)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    if (newDynamicModule.locString) expect(response.body.locString?.mainStr).to.equal(newDynamicModule.locString.mainStr);
    expect(response.body.moduleType).to.equal(newDynamicModule.moduleType);
    expect(response.body.page).to.equal(newDynamicModule.page);
    expect(response.body.placement).to.equal(newDynamicModule.placement);
    expect(response.body.placementType).to.equal(newDynamicModule.placementType);
    if (newDynamicModule.className) expect(response.body.className).to.equal(newDynamicModule.className);
    if (newDynamicModule.url) expect(response.body.url).to.equal(newDynamicModule.url);
    if (newDynamicModule.inlineCss) expect(response.body.inlineCss).to.equal(newDynamicModule.inlineCss);

  });

  it('DynamicModule PUT /:id updates dynamicModule data, can be used by admin', async () => {

    const updDynamicModule: EditDynamicModuleBody = {
      moduleType: 'cart',
      page: 'all',
      placement: 2,
      placementType: 'headerRight',
      className: 'some-class-for-header-right-side',
      inlineCss: '{ any valid inline CSS as JSON string }',
      locString: dynamicModules[0].locString ? {
        id: dynamicModules[0].locString.id,
        mainStr: 'Корзина',
        secStr: 'Cart'
      } : undefined
    };

    const response = await api
      .put(`${apiBaseUrl}/dynamic-module/${dynamicModules[0].id}`)
      .set('Cookie', [tokenCookie])
      .set('User-Agent', userAgent)
      .send(updDynamicModule)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const updDynamicModuleInDB = await DynamicModule.findByPk(dynamicModules[0].id, {
      attributes: {
        exclude: [...timestampsKeys]
      },
      include: [
        {
          model: Picture,
          as: 'picture',
          required: false,
          attributes: {
            exclude: [...timestampsKeys]
          },
          include: [
            includeAltTextLocNoTimestamps
          ]
        },
        includeLocStringNoTimestamps
      ]
    });

    if (updDynamicModule.locString) expect(response.body.locString?.mainStr).to.equal(updDynamicModule.locString.mainStr);
    expect(response.body.moduleType).to.equal(updDynamicModule.moduleType);
    expect(response.body.page).to.equal(updDynamicModule.page);
    expect(response.body.placement).to.equal(updDynamicModule.placement);
    expect(response.body.placementType).to.equal(updDynamicModule.placementType);
    if (updDynamicModule.className) expect(response.body.className).to.equal(updDynamicModule.className);
    if (updDynamicModule.url) expect(response.body.url).to.equal(updDynamicModule.url);
    if (updDynamicModule.inlineCss) expect(response.body.inlineCss).to.equal(updDynamicModule.inlineCss);

    if (updDynamicModule.locString) expect(updDynamicModuleInDB?.locString?.mainStr).to.equal(updDynamicModule.locString?.mainStr);
    expect(updDynamicModuleInDB?.moduleType).to.equal(updDynamicModule.moduleType);
    expect(updDynamicModuleInDB?.page).to.equal(updDynamicModule.page);
    expect(updDynamicModuleInDB?.placement).to.equal(updDynamicModule.placement);
    expect(updDynamicModuleInDB?.placementType).to.equal(updDynamicModule.placementType);
    if (updDynamicModule.className) expect(updDynamicModuleInDB?.className).to.equal(updDynamicModule.className);
    if (updDynamicModule.url) expect(updDynamicModuleInDB?.url).to.equal(updDynamicModule.url);
    if (updDynamicModule.inlineCss) expect(updDynamicModuleInDB?.inlineCss).to.equal(updDynamicModule.inlineCss);

  });

  it('DynamicModule DELETE /:id deletes dynamicModule, can be used by admin', async () => {

    await api
      .delete(`${apiBaseUrl}/dynamic-module/${dynamicModules[0].id}`)
      .set('Cookie', [tokenCookie])
      .set('User-Agent', userAgent)
      .expect(204);

  });

});