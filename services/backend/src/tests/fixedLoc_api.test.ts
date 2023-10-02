import type { EditFixedLocBody, NewFixedLocBody } from '@m-cafe-app/utils';
import { expect } from 'chai';
import 'mocha';
import supertest from 'supertest';
import app from '../app';
import { connectToDatabase, FixedLoc, LocString, User } from '@m-cafe-app/db';
import config from '../utils/config';
import { validAdminInDB, validManagerInDB } from './admin_api_helper';
import { Op } from 'sequelize';
import { Session } from '../redis/Session';
import { initLogin, userAgent } from './sessions_api_helper';
import { apiBaseUrl } from './test_helper';
import { validUserInDB } from './user_api_helper';
import { initFixedLocs } from '../utils/initFixedLocs';
import { fixedLocFilter } from '@m-cafe-app/shared-constants';



await connectToDatabase();
const api = supertest(app);


describe('FixedLoc requests tests', () => {

  let adminTokenCookie: string;
  let managerTokenCookie: string;
  let fixedLocs: FixedLoc[];

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
    await User.create(validManagerInDB.dbEntry);
    await Session.destroy({ where: {} });
    adminTokenCookie = await initLogin(validAdminInDB.dbEntry, validAdminInDB.password, api, 201, userAgent) as string;
    managerTokenCookie = await initLogin(validManagerInDB.dbEntry, validManagerInDB.password, api, 201, userAgent) as string;

    await FixedLoc.scope('admin').destroy({ where: {} });
    await LocString.destroy({ where: {} });

    await initFixedLocs();
    fixedLocs = await FixedLoc.scope('admin').findAll({});
  });

  it('FixedLoc GET routes work without authorization and give only customer-scoped fixedLocs', async () => {

    const customerFixedLocs = await FixedLoc.scope('customer').findAll({});

    const response1 = await api
      .get(`${apiBaseUrl}/fixed-loc/${customerFixedLocs[0].id}`)
      .set('User-Agent', userAgent)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const fixedLocInDB = await FixedLoc.scope('customer').findByPk(customerFixedLocs[0].id);

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

    const managerFixedLocs = await FixedLoc.scope('manager').findAll({});

    expect(response3.body).to.be.lengthOf(managerFixedLocs.length);
    expect(response3.body.length).to.be.lessThan(fixedLocs.length);

  });

  it('FixedLoc POST, PUT routes require admin rights', async () => {

    const response1 = await api
      .put(`${apiBaseUrl}/fixed-loc/reserve/${fixedLocs[0].id}`)
      .set('User-Agent', userAgent)
      .send({ some: 'crap' })
      .expect(401)
      .expect('Content-Type', /application\/json/);

    expect(response1.body.error.name).to.equal('AuthorizationError');

    await User.create(validUserInDB.dbEntry);

    const commonUserTokenCookie = await initLogin(validUserInDB.dbEntry, validUserInDB.password, api, 201, userAgent) as string; 

    const response2 = await api
      .put(`${apiBaseUrl}/fixed-loc/reserve/${fixedLocs[0].id}`)
      .set('Cookie', [commonUserTokenCookie])
      .set('User-Agent', userAgent)
      .send({ some: 'crap' })
      .expect(403)
      .expect('Content-Type', /application\/json/);

    expect(response2.body.error.name).to.equal('ProhibitedError');

    const response3 = await api
      .post(`${apiBaseUrl}/fixed-loc`)
      .set('Cookie', [commonUserTokenCookie])
      .set('User-Agent', userAgent)
      .send({ some: 'crap' })
      .expect(403)
      .expect('Content-Type', /application\/json/);

    expect(response3.body.error.name).to.equal('ProhibitedError');

    const response4 = await api
      .put(`${apiBaseUrl}/fixed-loc/${fixedLocs[0].id}`)
      .set('Cookie', [commonUserTokenCookie])
      .set('User-Agent', userAgent)
      .send({ some: 'crap' })
      .expect(403)
      .expect('Content-Type', /application\/json/);

    expect(response4.body.error.name).to.equal('ProhibitedError');

  });

  it('FixedLoc POST / adds new fixedLoc, can be used by admin', async () => {

    const newFixedLoc: NewFixedLocBody = {
      name: 'test',
      locString: {
        mainStr: 'Тест'
      },
      namespace: 'test',
      scope: 'customer',
    };

    const response = await api
      .post(`${apiBaseUrl}/fixed-loc`)
      .set('Cookie', [adminTokenCookie])
      .set('User-Agent', userAgent)
      .send(newFixedLoc)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    expect(response.body.name).to.equal(newFixedLoc.name);
    expect(response.body.locString.mainStr).to.equal(newFixedLoc.locString.mainStr);

  });

  it('FixedLoc PUT /:id updates fixedLoc data, can be used by admin', async () => {

    const updFixedLoc: EditFixedLocBody = {
      name: 'editTest', // fixed locs names must be unmutable, so the name does not get changed even if put for correct fixed loc id
      locString: {
        id: fixedLocs[0].locStringId,
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

    const updFixedLocInDB = await FixedLoc.scope('admin').findByPk(fixedLocs[0].id);

    expect(response.body.name).to.not.equal(updFixedLoc.name);
    expect(response.body.name).to.equal(fixedLocs[0].name);
    expect(response.body.locString.mainStr).to.equal(updFixedLoc.locString.mainStr);


    expect(updFixedLocInDB?.name).to.not.equal(updFixedLoc.name);
    expect(updFixedLocInDB?.name).to.equal(fixedLocs[0].name);
    expect(updFixedLocInDB?.locString?.mainStr).to.equal(updFixedLoc.locString.mainStr);

  });

  it('FixedLoc PUT /reserve/:id reserves fixedLoc by changing locString to reserved filter value, can be used by admin', async () => {

    const response = await api
      .put(`${apiBaseUrl}/fixed-loc/reserve/${fixedLocs[0].id}`)
      .set('Cookie', [adminTokenCookie])
      .set('User-Agent', userAgent)
      .expect(200);

    expect(response.body.name).to.equal(fixedLocs[0].name);
    expect(response.body.locString.mainStr).to.equal(fixedLocFilter);
    expect(response.body.locString.secStr).to.equal(fixedLocFilter);
    expect(response.body.locString.altStr).to.equal(fixedLocFilter);

  });

  after(async () => {

    // Cleanup because of fixedLoc.locStringId foreignKey is RESTRICT onDelete,
    // Means destroy all LocStrings will lead to errors in other tests
    await FixedLoc.scope('admin').destroy({ where: {} });
    await LocString.destroy({ where: {} });

  });

});