import { expect } from 'chai';
import 'mocha';
import supertest from 'supertest';
import app from '../app';
import { validAdminInDB } from './admin_api_helper';
import { initLogin, userAgent } from './sessions_api_helper';
import { apiBaseUrl } from './test_helper';
import { initFacilities } from './facility_api_helper';
import { facilityService, sessionService, userService } from '../controllers';
import { createUser } from './user_api_helper';


const api = supertest(app);


describe('App stability, middleware, routing, unhandled errors tests', () => {

  let tokenCookie: string;

  before(async () => {
    const keepSuperAdmin = true;
    await userService.removeAll(keepSuperAdmin);

    const admin = await createUser(validAdminInDB.dtn);
    await sessionService.removeAll();
    tokenCookie = await initLogin(admin, validAdminInDB.password, api, 201, userAgent) as string;

    await facilityService.removeAll();

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