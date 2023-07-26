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
import jwt from 'jsonwebtoken';
import { LoginUserBody } from "@m-cafe-app/utils";
import { isTokenBody } from "@m-cafe-app/utils";
import * as fc from 'fast-check';
import config from "../utils/config";



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
      .expect(201)
      .expect('Content-Type', /application\/json/);

    expect(isTokenBody(responseUsername.body)).to.equal(true);

    const loginBodyPhonenumber: LoginUserBody = {
      phonenumber: validUserInDB.dbEntry.phonenumber,
      password: validUserInDB.password
    };

    const responsePhonenumber = await api
      .post(`${apiBaseUrl}/session`)
      .send(loginBodyPhonenumber as object)
      .expect(201)
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
      .expect(201)
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
      .expect(201)
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
      .expect(201)
      .expect('Content-Type', /application\/json/);

    await api
      .post(`${apiBaseUrl}/session`)
      .set('User-Agent', userAgents[1])
      .send(loginBody as object)
      .expect(201)
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

  it('Token TTL and expire system works as intended, session gets deleted if expired token detected on protected route', async () => {

    const token = jwt.sign({
      id: validUserInDB.dbEntry.id,
      rand: Math.random() * 10000
    }, config.SECRET, { expiresIn: '1' });  // 1 ms to make sure it expires until the end of the test

    const newSession = {
      userId: validUserInDB.dbEntry.id,
      token,
      userAgent: 'SUPERTEST'
    };

    await Session.create(newSession);

    const response = await api
      .get(`${apiBaseUrl}/users/me`)
      .set({ Authorization: `bearer ${token}` })
      .set('User-Agent', 'SUPERTEST')
      .expect(401)
      .expect('Content-Type', /application\/json/);

    expect(response.body.error.name).to.equal('TokenExpiredError');
    expect(response.body.error.message).to.equal('Token expired. Please, relogin');

    const sessions = await Session.findAll({});

    expect(sessions).to.be.lengthOf(0);

  });

  it('Malformed / incorrect token is not accepted', async () => {

    const responseInvToken = await api
      .get(`${apiBaseUrl}/users/me`)
      .set({ Authorization: `bearer IAmALittleToken` })
      .expect(401)
      .expect('Content-Type', /application\/json/);

    expect(responseInvToken.body.error.name).to.equal('JsonWebTokenError');
    expect(responseInvToken.body.error.message).to.equal('Invalid token');


    const tokenInvSecret = jwt.sign({
      id: validUserInDB.dbEntry.id,
      rand: Math.random() * 10000
    }, 'IAmASpecialChineseSeckrette', { expiresIn: config.TOKEN_TTL });

    const responseInvSecret = await api
      .get(`${apiBaseUrl}/users/me`)
      .set({ Authorization: `bearer ${tokenInvSecret}` })
      .expect(401)
      .expect('Content-Type', /application\/json/);

    expect(responseInvSecret.body.error.name).to.equal('JsonWebTokenError');
    expect(responseInvSecret.body.error.message).to.equal('Invalid token');


    const tokenInvPayload = jwt.sign({
      rand: Math.random() * 10000
    }, config.SECRET, { expiresIn: config.TOKEN_TTL });

    const responseInvPayload = await api
      .get(`${apiBaseUrl}/users/me`)
      .set({ Authorization: `bearer ${tokenInvPayload}` })
      .expect(401)
      .expect('Content-Type', /application\/json/);

    expect(responseInvPayload.body.error.name).to.equal('AuthorizationError');
    expect(responseInvPayload.body.error.message).to.equal('Malformed token');

  });

  it('Valid token is accepted only when there is a Session record in DB for it', async () => {

    const tokenValid = jwt.sign({
      id: validUserInDB.dbEntry.id,
      rand: Math.random() * 10000
    }, config.SECRET, { expiresIn: config.TOKEN_TTL });

    const response = await api
      .get(`${apiBaseUrl}/users/me`)
      .set({ Authorization: `bearer ${tokenValid}` })
      .expect(401)
      .expect('Content-Type', /application\/json/);

    expect(response.body.error.name).to.equal('SessionError');
    expect(response.body.error.message).to.equal('Inactive session. Please, login');

  });

  it('Token refresh route works (route without a password, checks only for a valid token; must have a Session record)', async () => {

    const loginBody: LoginUserBody = {
      phonenumber: validUserInDB.dbEntry.phonenumber,
      password: validUserInDB.password
    };

    const response = await api
      .post(`${apiBaseUrl}/session`)
      .send(loginBody as object)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    if (!response.body.token) expect(true).to.equal(false);
    const token = response.body.token as string;

    const responseRefreshed = await api
      .get(`${apiBaseUrl}/session/refresh`)
      .set({ Authorization: `bearer ${token}` })
      .expect(200)
      .expect('Content-Type', /application\/json/);

    if (!responseRefreshed.body.token) expect(true).to.equal(false);
    const tokenRefreshed = responseRefreshed.body.token as string;

    expect(token).to.not.equal(tokenRefreshed);

  });

  it('Logout route deletes Session', async () => {

    const loginBody: LoginUserBody = {
      phonenumber: validUserInDB.dbEntry.phonenumber,
      password: validUserInDB.password
    };

    const response = await api
      .post(`${apiBaseUrl}/session`)
      .send(loginBody as object)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    if (!response.body.token) expect(true).to.equal(false);
    const token = response.body.token as string;

    await api
      .delete(`${apiBaseUrl}/session`)
      .set({ Authorization: `bearer ${token}` })
      .expect(204);

    const sessionsAfterLogout = await Session.findAll({ where: { userId: validUserInDB.dbEntry.id } });

    expect(sessionsAfterLogout).to.be.lengthOf(0);

  });

});
