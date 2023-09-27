import { expect } from 'chai';
import 'mocha';
import supertest from 'supertest';
import app from '../app';
import config from '../utils/config';
import { connectToDatabase, LocString, User } from '@m-cafe-app/db';
import { validAdminInDB } from './admin_api_helper';
import { Op } from 'sequelize';
import { Session } from '../redis/Session';
import { initLogin, userAgent } from './sessions_api_helper';
import { apiBaseUrl } from './test_helper';
import { initFacilities } from './facility_api_helper';



await connectToDatabase();
const api = supertest(app);


describe('App stability, middleware, routing, unhandled errors tests', () => {

  let tokenCookie: string;

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

    // on delete - cascade to facility, etc
    await LocString.destroy({ where: {} });

    await initFacilities();
  });

  it('checkParams middleware works', async () => {

    const response = await api
      .delete(`${apiBaseUrl}/facility/some_string`)
      .set('Cookie', [tokenCookie])
      .set('User-Agent', userAgent)
      .expect(400);

    expect(response.body.error.name).to.equal('RequestQueryError');
    expect(response.body.error.message).to.equal('Request params malformed');

  });

});