import type { FixedLocDT } from '@m-market-app/models';
import { expect } from 'chai';
import 'mocha';
import supertest from 'supertest';
import app from '../app';
import { createAdmin, createManager, validAdminInDB, validManagerInDB } from './admin_api_helper';
import { initLogin, userAgent } from './sessions_api_helper';
import { apiBaseUrl } from './test_helper';
import { createUser, validUserInDB } from './user_api_helper';
import { fixedLocService, sessionService, userService } from '../controllers';
import { FIXED_LOCS_EXT, FIXED_LOCS_PATH } from '../utils/config';


const api = supertest(app);


describe('FixedLoc requests tests', () => {

  let adminTokenCookie: string;
  let managerTokenCookie: string;
  let fixedLocs: FixedLocDT[];

  before(async () => {
    const keepSuperAdmin = true;
    await userService.removeAll(keepSuperAdmin);

    const admin = await createAdmin(validAdminInDB.dtn);
    const manager = await createManager(validManagerInDB.dtn);
    await sessionService.removeAll();
    adminTokenCookie = await initLogin(admin, validAdminInDB.password, api, 201, userAgent) as string;
    managerTokenCookie = await initLogin(manager, validManagerInDB.password, api, 201, userAgent) as string;

    await fixedLocService.removeAll();
    await fixedLocService.locStringRepo.removeAll();

    await fixedLocService.initFixedLocs(FIXED_LOCS_PATH, FIXED_LOCS_EXT);
    fixedLocs = await fixedLocService.getAll();
  });

  it('FixedLoc GET routes work without authorization and give only customer-scoped fixedLocs', async () => {

    const customerFixedLocs = await fixedLocService.getByScope('customer');

    const response1 = await api
      .get(`${apiBaseUrl}/fixed-loc/${customerFixedLocs[0].id}`)
      .set('User-Agent', userAgent)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const fixedLocInDB = await fixedLocService.getById(customerFixedLocs[0].id);

    expect(response1.body.name).to.equal(fixedLocInDB?.name);
    expect(response1.body.locString.mainStr).to.equal(fixedLocInDB?.locString?.mainStr);

    const response2 = await api
      .get(`${apiBaseUrl}/fixed-loc`)
      .set('User-Agent', userAgent)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response2.body).to.be.lengthOf(customerFixedLocs.length);
    expect(response2.body.length).to.be.lessThan(fixedLocs.length);

  });

  it('FixedLoc GET routes give accordingly-scoped fixedLocs to authorized users', async () => {

    const response1 = await api
      .get(`${apiBaseUrl}/fixed-loc/${fixedLocs[0].id}`)
      .set('Cookie', [adminTokenCookie])
      .set('User-Agent', userAgent)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response1.body.name).to.equal(fixedLocs[0].name);
    expect(response1.body.locString.mainStr).to.equal(fixedLocs[0]?.locString?.mainStr);

    const response2 = await api
      .get(`${apiBaseUrl}/fixed-loc`)
      .set('Cookie', [adminTokenCookie])
      .set('User-Agent', userAgent)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response2.body).to.be.lengthOf(fixedLocs.length);

    const response3 = await api
      .get(`${apiBaseUrl}/fixed-loc`)
      .set('Cookie', [managerTokenCookie])
      .set('User-Agent', userAgent)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const managerFixedLocs = await fixedLocService.getByScope('manager');

    expect(response3.body).to.be.lengthOf(managerFixedLocs.length);
    expect(response3.body.length).to.be.lessThan(fixedLocs.length);

  });

  it('FixedLoc PUT routes require admin rights', async () => {

    const someNonsenseUpdateFixedLoc: FixedLocDT = {
      id: fixedLocs[0].id,
      name: fixedLocs[0].name,
      namespace: fixedLocs[0].namespace,
      scope: fixedLocs[0].scope,
      locString: {
        id: fixedLocs[0].locString.id,
        mainStr: 'nonsense',
        secStr: 'moar nonsense',
        altStr: fixedLocs[0].locString.altStr
      }
    };

    const response1 = await api
      .put(`${apiBaseUrl}/fixed-loc/${fixedLocs[0].id}`)
      .set('User-Agent', userAgent)
      .send(someNonsenseUpdateFixedLoc)
      .expect(401)
      .expect('Content-Type', /application\/json/);

    expect(response1.body.error.name).to.equal('AuthorizationError');

    const customer = await createUser(validUserInDB.dtn);

    const commonUserTokenCookie = await initLogin(customer, validUserInDB.password, api, 201, userAgent) as string; 

    const response2 = await api
      .put(`${apiBaseUrl}/fixed-loc/${fixedLocs[0].id}`)
      .set('Cookie', [commonUserTokenCookie])
      .set('User-Agent', userAgent)
      .send(someNonsenseUpdateFixedLoc)
      .expect(403)
      .expect('Content-Type', /application\/json/);

    expect(response2.body.error.name).to.equal('ProhibitedError');

  });

  it('FixedLoc PUT /:id updates fixedLoc data, can be used by admin', async () => {

    const updFixedLoc: FixedLocDT = {
      id: fixedLocs[0].id,
      name: 'editTest', // fixed locs names must be unmutable, so the name does not get changed even if put for correct fixed loc id
      locString: {
        id: fixedLocs[0].locString.id,
        mainStr: 'Тест по изменению'
      },
      namespace: 'test',
      scope: 'customer',
    };

    const response = await api
      .put(`${apiBaseUrl}/fixed-loc/${fixedLocs[0].id}`)
      .set('Cookie', [adminTokenCookie])
      .set('User-Agent', userAgent)
      .send(updFixedLoc)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const updFixedLocInDB = await fixedLocService.getById(updFixedLoc.id);

    expect(response.body.name).to.not.equal(updFixedLoc.name);
    expect(response.body.name).to.equal(fixedLocs[0].name);
    expect(response.body.locString.mainStr).to.equal(updFixedLoc.locString.mainStr);


    expect(updFixedLocInDB?.name).to.not.equal(updFixedLoc.name);
    expect(updFixedLocInDB?.name).to.equal(fixedLocs[0].name);
    expect(updFixedLocInDB?.locString?.mainStr).to.equal(updFixedLoc.locString.mainStr);

  });

  after(async () => {

    // Cleanup because of fixedLoc.locStringId foreignKey is RESTRICT onDelete,
    // Means destroy all LocStrings will lead to errors in other tests
    await fixedLocService.removeAll();
    await fixedLocService.locStringRepo.removeAll();

  });

});