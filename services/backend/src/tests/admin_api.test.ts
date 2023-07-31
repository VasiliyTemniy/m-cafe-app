import { expect } from "chai";
import "mocha";
import supertest from 'supertest';
import app from "../app";
import { apiBaseUrl } from './test_helper';
import { connectToDatabase } from "../utils/db";
import { User } from '../models/index';
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
});


describe('Admin router basics', () => {

  let validAdminInDBID: number;
  let validUserInDBID: number;

  beforeEach(async () => {
    await User.destroy({
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

  it('The super admin gets created, process envs with his password, username, phonenumber get zeroified', async () => {


  });

});