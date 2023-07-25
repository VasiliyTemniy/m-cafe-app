import { expect } from "chai";
import "mocha";
import supertest from 'supertest';
import app from "../app";
import { apiBaseUrl } from './test_helper';
import {
  initialUsers,
  validUserInDB,
} from './users_api_helper';
import { Session, User } from '../models/index';
import { connectToDatabase } from "../utils/db";
import { initSuperAdmin } from "../utils/adminInit";

import { LoginUserBody } from "@m-cafe-app/utils";
import { isTokenBody } from "@m-cafe-app/utils";
import * as fc from 'fast-check';



await connectToDatabase();
const api = supertest(app);


describe('Login and session', () => {

  before(async () => {
    await User.destroy({ where: {} });
    await User.bulkCreate(initialUsers);
    await initSuperAdmin();
    await User.create(validUserInDB.dbEntry);
  });

  beforeEach(async () => {
    await Session.destroy({ where: {} });
  });

  it('User login with correct credentials as password and (username or phonenumber) \
succeds and gives token + id (userId) as response', async () => {

    const loginBodyUsername: LoginUserBody = {
      username: validUserInDB.dbEntry.username as string,
      password: validUserInDB.password
    };

    const responseUsername = await api
      .post(`${apiBaseUrl}/session`)
      .send(loginBodyUsername as object)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(isTokenBody(responseUsername.body)).to.equal(true);

    const loginBodyPhonenumber: LoginUserBody = {
      phonenumber: validUserInDB.dbEntry.phonenumber,
      password: validUserInDB.password
    };

    const responsePhonenumber = await api
      .post(`${apiBaseUrl}/session`)
      .send(loginBodyPhonenumber as object)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(isTokenBody(responsePhonenumber.body)).to.equal(true);

  });

  it('User login leads to creation of a session with user id and token. Sequential login attempt from the \
same browser(userAgent) without logout leads to session token refresh', async () => {

    const loginBody: LoginUserBody = {
      phonenumber: validUserInDB.dbEntry.phonenumber,
      password: validUserInDB.password
    };

    const responseFirst = await api
      .post(`${apiBaseUrl}/session`)
      .set('User-Agent', 'SUPERTEST')
      .send(loginBody as object)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    if (!responseFirst.body.token) expect(true).to.equal(false);
    const tokenFirst = responseFirst.body.token as string;

    const sessionFirst = await Session.findAll({ where: { userId: validUserInDB.dbEntry.id } });

    expect(sessionFirst).to.be.lengthOf(1);
    expect(sessionFirst[0].token).to.equal(tokenFirst);

    const responseSecond = await api
      .post(`${apiBaseUrl}/session`)
      .set('User-Agent', 'SUPERTEST')
      .send(loginBody as object)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    if (!responseSecond.body.token) expect(true).to.equal(false);
    const tokenSecond = responseSecond.body.token as string;

    const sessionSecond = await Session.findAll({ where: { userId: validUserInDB.dbEntry.id } });

    expect(sessionSecond).to.be.lengthOf(1);
    expect(sessionSecond[0].token).to.equal(tokenSecond);

    expect(sessionFirst[0].id).to.equal(sessionSecond[0].id);

  });

  it('User login from different browsers create different sessions', async () => {

    const loginBody: LoginUserBody = {
      phonenumber: validUserInDB.dbEntry.phonenumber,
      password: validUserInDB.password
    };

    const userAgents = ['SUPERTEST', 'MEGAUBERTEST'];

    await api
      .post(`${apiBaseUrl}/session`)
      .set('User-Agent', userAgents[0])
      .send(loginBody as object)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    await api
      .post(`${apiBaseUrl}/session`)
      .set('User-Agent', userAgents[1])
      .send(loginBody as object)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const sessions = await Session.findAll({ where: { userId: validUserInDB.dbEntry.id } });

    expect(sessions).to.be.lengthOf(2);

    expect(sessions[0].id).not.to.be.equal(sessions[1].id);
    expect(sessions[0].token).not.to.be.equal(sessions[1].token);
    expect(sessions[0].userAgent).not.to.be.equal(sessions[1].userAgent);

    expect(sessions[0].userId).to.be.equal(sessions[1].userId);

    const userAgentsInDB = sessions.map(session => session.userAgent);

    expect(userAgentsInDB).to.have.members(userAgents);

  });

  it('User login with incorrect credentials fails', async () => {

    const loginBody: LoginUserBody = {
      phonenumber: validUserInDB.dbEntry.phonenumber,
      password: 'DasIstBeliberda'
    };

    const response = await api
      .post(`${apiBaseUrl}/session`)
      .send(loginBody as object)
      .expect(401)
      .expect('Content-Type', /application\/json/);

    expect(response.body.error.name).to.equal('CredentialsError');
    expect(response.body.error.message).to.equal('Invalid login or password');

  });

  it('User login with incorrect credentials fails - property test', async () => {

    const loginStateProperty = fc.asyncProperty(fc.string(), async (password) => {

      if (password === validUserInDB.password) expect(true).to.equal(true);
      else {

        const response = await api
          .post(`${apiBaseUrl}/session`)
          .send({
            phonenumber: validUserInDB.dbEntry.phonenumber,
            password
          })
          .expect(401)
          .expect('Content-Type', /application\/json/);

        expect(response.body.error.name).to.equal('CredentialsError');
        expect(response.body.error.message).to.equal('Invalid login or password');

      }

    });

    await fc.assert(loginStateProperty, { numRuns: 10 });

  });

});
