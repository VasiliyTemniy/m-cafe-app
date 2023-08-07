import { expect } from "chai";
import "mocha";
import supertest from 'supertest';
import app from "../app";
import { apiBaseUrl } from './test_helper';
import {
  initialUsers,
  validUserInDB,
} from './users_api_helper';
import { User } from '../models/index';
import { Session } from "../redis/Session";
import { connectToDatabase } from "../utils/db";
import jwt from 'jsonwebtoken';
import { LoginUserBody } from "@m-cafe-app/utils";
import * as fc from 'fast-check';
import config from "../utils/config";
import { initLogin, userAgent } from "./sessions_api_helper";
import sha1 from 'sha1';



await connectToDatabase();
const api = supertest(app);


describe('Login and session', () => {

  let validUserInDBID: number;

  before(async () => {
    await User.scope('all').destroy({ force: true, where: {} });
    await User.bulkCreate(initialUsers);
    const user = await User.create(validUserInDB.dbEntry);

    validUserInDBID = user.id;
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
      .send(loginBodyUsername)
      .expect(201);

    expect(responseUsername.headers['set-cookie']).to.exist;

    const loginBodyPhonenumber: LoginUserBody = {
      phonenumber: validUserInDB.dbEntry.phonenumber,
      password: validUserInDB.password
    };

    const responsePhonenumber = await api
      .post(`${apiBaseUrl}/session`)
      .send(loginBodyPhonenumber)
      .expect(201);

    expect(responsePhonenumber.headers['set-cookie']).to.exist;

  });

  it('Token is sent via http-only cookie; This cookie is accepted by backend middleware; Authorization: bearer is not accepted', async () => {

    const loginBody: LoginUserBody = {
      phonenumber: validUserInDB.dbEntry.phonenumber,
      password: validUserInDB.password
    };

    const response1 = await api
      .post(`${apiBaseUrl}/session`)
      .set('User-Agent', userAgent)
      .send(loginBody as object)
      .expect(201);

    expect(response1.headers['set-cookie']).to.exist;

    const cookieMessage = response1.headers['set-cookie'][0] as string;

    const cookieParts = cookieMessage.split('; ');

    expect(cookieParts[cookieParts.length - 1]).to.equal('HttpOnly');

    const token = cookieParts[0].substring(6);

    const response2 = await api
      .get(`${apiBaseUrl}/users/me`)
      .set({ Authorization: `bearer ${token}` })
      .set('User-Agent', userAgent)
      .expect(401)
      .expect('Content-Type', /application\/json/);

    expect(response2.body.error.name).to.equal('AuthorizationError');
    expect(response2.body.error.message).to.equal('Authorization required');

    const response3 = await api
      .get(`${apiBaseUrl}/users/me`)
      .set("Cookie", [response1.headers['set-cookie'][0] as string])
      .set('User-Agent', userAgent)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response3.body.username).to.equal(validUserInDB.dbEntry.username);

  });

  it('User login leads to creation of a session with user id and token. Sequential login attempt from the \
same browser(userAgent) without logout leads to session token refresh', async () => {

    const tokenCookieFirst = await initLogin(validUserInDB.dbEntry, validUserInDB.password, api, 201, 'SUPERTEST') as string;

    const sessionsFirst = await Session.findAll({ where: { userId: validUserInDBID } });

    expect(sessionsFirst).to.be.lengthOf(1);
    expect(sessionsFirst[0].token).to.equal(tokenCookieFirst.split('; ')[0].substring(6));

    const tokenCookieSecond = await initLogin(validUserInDB.dbEntry, validUserInDB.password, api, 201, 'SUPERTEST') as string;

    const sessionsSecond = await Session.findAll({ where: { userId: validUserInDBID } });

    expect(sessionsSecond).to.be.lengthOf(1);
    expect(sessionsSecond[0].token).to.equal(tokenCookieSecond.split('; ')[0].substring(6));

  });

  it('User login from different browsers create different sessions', async () => {

    const userAgents = ['SUPERTEST', 'MEGAUBERTEST'];

    await initLogin(validUserInDB.dbEntry, validUserInDB.password, api, 201, userAgents[0]);

    await initLogin(validUserInDB.dbEntry, validUserInDB.password, api, 201, userAgents[1]);

    const sessions = await Session.findAll({ where: { userId: validUserInDBID } });

    expect(sessions).to.be.lengthOf(2);

    expect(sessions[0].token).not.to.be.equal(sessions[1].token);
    expect(sessions[0].userAgent).not.to.be.equal(sessions[1].userAgent);

    expect(sessions[0].userId).to.be.equal(sessions[1].userId);

    const userAgentsInDB = sessions.map(session => session.userAgent);

    const hashedUserAgents = userAgents.map(agent => sha1(agent));

    expect(userAgentsInDB).to.have.members(hashedUserAgents);

  });

  it('User login with incorrect credentials fails', async () => {

    const loginBody: LoginUserBody = {
      phonenumber: validUserInDB.dbEntry.phonenumber,
      password: 'DasIstBeliberda'
    };

    const response = await api
      .post(`${apiBaseUrl}/session`)
      .send(loginBody)
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
      id: validUserInDBID,
      rand: Math.random() * 10000
    }, config.SECRET, { expiresIn: '1' });  // 1 ms to make sure it expires until the end of the test

    const newSession = {
      userId: validUserInDBID,
      token,
      userAgent: 'SUPERTEST'
    };

    const userInDB = await User.findByPk(validUserInDBID);

    if (!userInDB) return expect(true).to.equal(false);

    await Session.create(newSession, userInDB.rights);

    const tokenCookie = `token=${token}; HttpOnly`;

    const response = await api
      .get(`${apiBaseUrl}/users/me`)
      .set("Cookie", [tokenCookie])
      .set('User-Agent', 'SUPERTEST')
      .expect(401)
      .expect('Content-Type', /application\/json/);

    expect(response.body.error.name).to.equal('TokenExpiredError');
    expect(response.body.error.message).to.equal('Token expired. Please, relogin');

    const sessions = await Session.findAll({ where: { userId: validUserInDBID } });

    expect(sessions).to.be.lengthOf(0);

  });

  it('Malformed / incorrect token is not accepted', async () => {

    const invalidTokenCookie = `token=IAmALittleToken; HttpOnly`;

    const responseInvToken = await api
      .get(`${apiBaseUrl}/users/me`)
      .set("Cookie", [invalidTokenCookie])
      .expect(401)
      .expect('Content-Type', /application\/json/);

    expect(responseInvToken.body.error.name).to.equal('JsonWebTokenError');
    expect(responseInvToken.body.error.message).to.equal('Invalid token');


    const tokenInvSecret = jwt.sign({
      id: validUserInDBID,
      rand: Math.random() * 10000
    }, 'IAmASpecialChineseSeckrette', { expiresIn: config.TOKEN_TTL });

    const tokenInvSecretCookie = `token=${tokenInvSecret}; HttpOnly`;

    const responseInvSecret = await api
      .get(`${apiBaseUrl}/users/me`)
      .set("Cookie", [tokenInvSecretCookie])
      .expect(401)
      .expect('Content-Type', /application\/json/);

    expect(responseInvSecret.body.error.name).to.equal('JsonWebTokenError');
    expect(responseInvSecret.body.error.message).to.equal('Invalid token');


    const tokenInvPayload = jwt.sign({
      rand: Math.random() * 10000
    }, config.SECRET, { expiresIn: config.TOKEN_TTL });

    const tokenInvPayloadCookie = `token=${tokenInvPayload}; HttpOnly`;

    const responseInvPayload = await api
      .get(`${apiBaseUrl}/users/me`)
      .set("Cookie", [tokenInvPayloadCookie])
      .expect(401)
      .expect('Content-Type', /application\/json/);

    expect(responseInvPayload.body.error.name).to.equal('AuthorizationError');
    expect(responseInvPayload.body.error.message).to.equal('Malformed token');

  });

  it('Valid token is accepted only when there is a Session record in DB for it', async () => {

    const tokenValid = jwt.sign({
      id: validUserInDBID,
      rand: Math.random() * 10000
    }, config.SECRET, { expiresIn: config.TOKEN_TTL });

    const tokenValidCookie = `token=${tokenValid}; HttpOnly`;

    const response = await api
      .get(`${apiBaseUrl}/users/me`)
      .set("Cookie", [tokenValidCookie])
      .expect(401)
      .expect('Content-Type', /application\/json/);

    expect(response.body.error.name).to.equal('SessionError');
    expect(response.body.error.message).to.equal('Inactive session. Please, login');

  });

  it('Token refresh route works (route without a password, checks only for a valid token; must have a Session record)', async () => {

    const tokenCookie = await initLogin(validUserInDB.dbEntry, validUserInDB.password, api, 201, userAgent) as string;

    const token = tokenCookie.split('; ')[0].substring(6);

    const responseRefreshed = await api
      .get(`${apiBaseUrl}/session/refresh`)
      .set("Cookie", [tokenCookie])
      .set('User-Agent', userAgent)
      .expect(200);

    if (!responseRefreshed.headers['set-cookie']) return expect(true).to.equal(false);

    const loginCookiesRefreshed = responseRefreshed.headers['set-cookie'] as string[];

    const tokenCookieRefreshed = loginCookiesRefreshed.find(cookie => cookie.startsWith('token='));

    if (!tokenCookieRefreshed) return expect(true).to.equal(false);

    const tokenRefreshed = tokenCookieRefreshed.split('; ')[0].substring(6);

    expect(token).to.not.equal(tokenRefreshed);

  });

  it('Logout route deletes Session', async () => {

    const tokenCookie = await initLogin(validUserInDB.dbEntry, validUserInDB.password, api, 201, userAgent) as string;

    await api
      .delete(`${apiBaseUrl}/session`)
      .set("Cookie", [tokenCookie])
      .set('User-Agent', userAgent)
      .expect(204);

    const sessionsAfterLogout = await Session.findAll({ where: { userId: validUserInDBID } });

    expect(sessionsAfterLogout).to.be.lengthOf(0);

  });

});
