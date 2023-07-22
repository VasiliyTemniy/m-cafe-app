import { expect } from "chai";
import "mocha";
import supertest from 'supertest';
import app from "../app";
import { initialUsers, apiBaseUrl } from './test_helper';
import { User } from '../models/index';
import { connectToDatabase } from "../utils/db";
// import { initSuperAdmin } from "../utils/adminInit";

await connectToDatabase();
const api = supertest(app);

describe('User POST request tests', () => {

  beforeEach(async () => {
    await User.destroy({ where: {} });
    await User.bulkCreate(initialUsers);
  });

  it('a valid user can be added ', async () => {
    const newUser = {
      username: 'Ordan',
      name: 'Dmitry Dornichev',
      password: 'iwannabeahero',
      phonenumber: '89354652235'
    };

    await api
      .post(`${apiBaseUrl}/users`)
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await User.findAll({});
    expect(usersAtEnd).to.have.lengthOf(initialUsers.length + 1);

    const usernames = usersAtEnd.map(user => user.username);
    expect(usernames).to.contain(
      'Ordan'
    );
  });

  it('user without phonenumber is not added', async () => {
    const newUser = {
      username: 'Ordan',
      name: 'Dmitry Dornichev',
      password: 'iwannabeahero'
    };

    const result = await api
      .post(`${apiBaseUrl}/users`)
      .send(newUser)
      .expect(400);

    expect(result.body.error.name).to.equal('RequestBodyError');
    expect(result.body.error.message).to.equal('Invalid new user request body');

    const usersAtEnd = await User.findAll({});

    expect(usersAtEnd).to.have.lengthOf(initialUsers.length);
  });

  it('user with only password and phonenumber is added', async () => {
    const newUser = {
      password: 'iwannabeahero',
      phonenumber: '89354652235'
    };

    await api
      .post(`${apiBaseUrl}/users`)
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await User.findAll({});
    expect(usersAtEnd).to.have.lengthOf(initialUsers.length + 1);

    const phonenumbers = usersAtEnd.map(user => user.phonenumber);
    expect(phonenumbers).to.contain(
      '89354652235'
    );
  });

  it('username must be unique, if not - new user is not added', async () => {
    const newUser = {
      username: "StevieDoesntKnow", // already in initialUsers
      name: 'Dmitry Dornichev',
      password: 'iwannabeahero',
      phonenumber: '89354652235'
    };

    const result = await api
      .post(`${apiBaseUrl}/users`)
      .send(newUser)
      .expect(409);

    expect(result.body.error.name).to.equal('SequelizeUniqueConstraintError');
    expect(result.body.error.message).to.equal('Some internal constraints error');

    expect(result.body.error.originalError).to.exist;

    const usersAtEnd = await User.findAll({});

    expect(usersAtEnd).to.have.lengthOf(initialUsers.length);
  });

  it('phonenumber must be unique, if not - new user is not added', async () => {
    const newUser = {
      username: "Ordan",
      name: 'Dmitry Dornichev',
      password: 'iwannabeahero',
      phonenumber: '88003561256' // already in initialUsers
    };

    const result = await api
      .post(`${apiBaseUrl}/users`)
      .send(newUser)
      .expect(409);

    expect(result.body.error.name).to.equal('SequelizeUniqueConstraintError');
    expect(result.body.error.message).to.equal('Some internal constraints error');

    expect(result.body.error.originalError).to.exist;

    const usersAtEnd = await User.findAll({});

    expect(usersAtEnd).to.have.lengthOf(initialUsers.length);
  });

});

describe('Protected paths', () => {

  beforeEach(async () => {
    await User.destroy({ where: {} });
    await User.bulkCreate(initialUsers);
    // await initSuperAdmin();
  });

  it('User login with correct credentials succeds', async () => {

  });

  it('User login with incorrect credentials fails', async () => {

  });

  describe('User PUT request tests', () => {

    it('a valid request to change user credentials succeds', async () => {
      const newUser = {
        username: 'Ordan',
        name: 'Dmitry Dornichev',
        password: 'iwannabeahero',
        phonenumber: '89354652235'
      };

      await api
        .post(`${apiBaseUrl}/users`)
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/);

      const usersAtEnd = await User.findAll({});
      expect(usersAtEnd).to.have.lengthOf(initialUsers.length + 1);

      const usernames = usersAtEnd.map(user => user.username);
      expect(usernames).to.contain(
        'Ordan'
      );
    });

  });

});