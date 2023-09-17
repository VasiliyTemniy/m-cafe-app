import {
  EditFixedLocBody,
  NewFixedLocBody,
  timestampsKeys
} from "@m-cafe-app/utils";
import { expect } from "chai";
import "mocha";
import supertest from 'supertest';
import app from "../app";
import { connectToDatabase, FixedLoc, LocString, User } from '@m-cafe-app/db';
import config from "../utils/config";
import { validAdminInDB } from "./admin_api_helper";
import { Op } from 'sequelize';
import { Session } from "../redis/Session";
import { initLogin, userAgent } from "./sessions_api_helper";
import { apiBaseUrl } from "./test_helper";
import { validUserInDB } from "./user_api_helper";
import { initFixedLocs } from "../utils/initFixedLocs";
import { includeLocStringNoTimestamps } from "../utils/sequelizeHelpers";



await connectToDatabase();
const api = supertest(app);


describe('FixedLoc requests tests', () => {

  let tokenCookie: string;
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
    await Session.destroy({ where: {} });
    tokenCookie = await initLogin(validAdminInDB.dbEntry, validAdminInDB.password, api, 201, userAgent) as string;

    await FixedLoc.destroy({ where: {} });
    await LocString.destroy({ where: {} });

    await initFixedLocs();
    fixedLocs = await FixedLoc.findAll({});
  });

  it('FixedLoc GET routes work without authorization', async () => {

    const response1 = await api
      .get(`${apiBaseUrl}/fixed-loc/${fixedLocs[0].id}`)
      .set('User-Agent', userAgent)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const fixedLocInDB = await FixedLoc.findByPk(fixedLocs[0].id, {
      attributes: {
        exclude: [...timestampsKeys]
      },
      include: [
        includeLocStringNoTimestamps
      ]
    });

    expect(response1.body.name).to.equal(fixedLocInDB?.name);
    expect(response1.body.locString.mainStr).to.equal(fixedLocInDB?.locString?.mainStr);

    const response2 = await api
      .get(`${apiBaseUrl}/fixed-loc`)
      .set('User-Agent', userAgent)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response2.body).to.be.lengthOf(fixedLocs.length);

  });

  it('FixedLoc POST, PUT, DELETE routes require admin rights', async () => {

    const response1 = await api
      .delete(`${apiBaseUrl}/fixed-loc/${fixedLocs[0].id}`)
      .set('User-Agent', userAgent)
      .expect(401)
      .expect('Content-Type', /application\/json/);

    expect(response1.body.error.name).to.equal('AuthorizationError');

    await User.create(validUserInDB.dbEntry);

    const commonUserTokenCookie = await initLogin(validUserInDB.dbEntry, validUserInDB.password, api, 201, userAgent) as string; 

    const response2 = await api
      .delete(`${apiBaseUrl}/fixed-loc/${fixedLocs[0].id}`)
      .set("Cookie", [commonUserTokenCookie])
      .set('User-Agent', userAgent)
      .expect(403)
      .expect('Content-Type', /application\/json/);

    expect(response2.body.error.name).to.equal('ProhibitedError');

    const response3 = await api
      .post(`${apiBaseUrl}/fixed-loc`)
      .set("Cookie", [commonUserTokenCookie])
      .set('User-Agent', userAgent)
      .send({ some: 'crap' })
      .expect(403)
      .expect('Content-Type', /application\/json/);

    expect(response3.body.error.name).to.equal('ProhibitedError');

    const response4 = await api
      .put(`${apiBaseUrl}/fixed-loc/${fixedLocs[0].id}`)
      .set("Cookie", [commonUserTokenCookie])
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
      }
    };

    const response = await api
      .post(`${apiBaseUrl}/fixed-loc`)
      .set("Cookie", [tokenCookie])
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
      }
    };

    const response = await api
      .put(`${apiBaseUrl}/fixed-loc/${fixedLocs[0].id}`)
      .set("Cookie", [tokenCookie])
      .set('User-Agent', userAgent)
      .send(updFixedLoc)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const updFixedLocInDB = await FixedLoc.findByPk(fixedLocs[0].id, {
      attributes: {
        exclude: [...timestampsKeys]
      },
      include: [
        includeLocStringNoTimestamps
      ]
    });

    expect(response.body.name).to.not.equal(updFixedLoc.name);
    expect(response.body.name).to.equal(fixedLocs[0].name);
    expect(response.body.locString.mainStr).to.equal(updFixedLoc.locString.mainStr);


    expect(updFixedLocInDB?.name).to.not.equal(updFixedLoc.name);
    expect(updFixedLocInDB?.name).to.equal(fixedLocs[0].name);
    expect(updFixedLocInDB?.locString?.mainStr).to.equal(updFixedLoc.locString.mainStr);

  });

  it('FixedLoc DELETE /:id deletes fixedLoc, can be used by admin', async () => {

    await api
      .delete(`${apiBaseUrl}/fixed-loc/${fixedLocs[0].id}`)
      .set("Cookie", [tokenCookie])
      .set('User-Agent', userAgent)
      .expect(204);

  });

  after(async () => {

    // Cleanup because of fixedLoc.locStringId foreignKey is RESTRICT onDelete,
    // Means destroy all LocStrings will lead to errors in other tests
    await FixedLoc.destroy({ where: {} });
    await LocString.destroy({ where: {} });

  });

});