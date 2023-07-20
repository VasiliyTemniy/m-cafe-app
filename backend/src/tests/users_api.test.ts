import { expect } from "chai";
import "mocha";
import supertest from 'supertest';
import app from "../app";
import { initialUsers, apiBaseUrl } from './test_helper';
import { User } from '../models/index';

const api = supertest(app);

beforeEach(async () => {
  await User.destroy({ where: {} });
  await User.bulkCreate(initialUsers);
});


describe('User POST request tests', () => {

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

  it('user without username is not added', async () => {
    const newUser = {
      name: 'Dmitry Dornichev',
      password: 'iwannabeahero',
      phonenumber: '89354652235'
    };

    const result = await api
      .post(`${apiBaseUrl}/users`)
      .send(newUser)
      .expect(400);

    expect(result.body.error).to.contain('Invalid new user request body');

    const usersAtEnd = await User.findAll({});

    expect(usersAtEnd).to.have.lengthOf(initialUsers.length);
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
      .expect(400);

    expect(result.body.error).to.contain('username must be unique');

    const usersAtEnd = await User.findAll({});

    expect(usersAtEnd).to.have.lengthOf(initialUsers.length);
  });

});

// afterAll(() => {
  
// });