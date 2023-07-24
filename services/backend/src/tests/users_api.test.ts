import { expect } from "chai";
import "mocha";
import supertest from 'supertest';
import app from "../app";
import { apiBaseUrl } from './test_helper';
import {
  initialUsers,
  genCorrectUsername,
  genCorrectName,
  genCorrectPhonenumber,
  genCorrectEmail,
  genIncorrectString,
  validNewUserFull
} from './users_api_helper';
import { User } from '../models/index';
import { connectToDatabase } from "../utils/db";
import logger from "../utils/logger";
// import { initSuperAdmin } from "../utils/adminInit";
import { ValidationError } from 'sequelize';
import {
  dateRegExp,
  emailRegExp,
  maxEmailLen,
  maxNameLen,
  maxPhonenumberLen,
  maxUsernameLen,
  minEmailLen,
  minNameLen,
  minPhonenumberLen,
  minUsernameLen,
  nameRegExp,
  phonenumberRegExp,
  usernameRegExp
} from "../utils/constants";
// import fc from 'fast-check';



await connectToDatabase();
const api = supertest(app);

logger.shout('Test starts');

describe('User POST request tests', () => {

  beforeEach(async () => {
    await User.destroy({ where: {} });
    await User.bulkCreate(initialUsers);
  });

  it('A valid user can be added ', async () => {
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

    const newUserFull = validNewUserFull;

    await api
      .post(`${apiBaseUrl}/users`)
      .send(newUserFull)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await User.findAll({});
    expect(usersAtEnd).to.have.lengthOf(initialUsers.length + 2);

    const userCheck = await User.findOne({ where: { username: newUserFull.username } });
    expect(userCheck).to.exist;
    if (!userCheck) return;

    expect(userCheck.username).to.equal('Petro');
    expect(userCheck.name).to.equal('Vasilenko Pyotr Ivanovich');
    expect(userCheck.phonenumber).to.equal('89354652288');
    expect(userCheck.email).to.equal('my-email.vah@jjjjppp.com');
    expect(userCheck.birthdate.toISOString()).to.equal('2001-07-23T07:31:03.242Z');

    const usernames = usersAtEnd.map(user => user.username);
    expect(usernames).to.contain('Ordan');
  });

  it('User without phonenumber is not added', async () => {
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

  it('User with only password and phonenumber is added', async () => {
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

  it('Username must be unique, if not - new user is not added', async () => {
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
    expect(result.body.error.message).to.equal('Some internal DB constraints error or Sequelize error');

    expect(result.body.error.originalError).to.exist;

    const usersAtEnd = await User.findAll({});

    expect(usersAtEnd).to.have.lengthOf(initialUsers.length);
  });

  it('Phonenumber must be unique, if not - new user is not added', async () => {
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
    expect(result.body.error.message).to.equal('Some internal DB constraints error or Sequelize error');

    expect(result.body.error.originalError).to.exist;

    const usersAtEnd = await User.findAll({});

    expect(usersAtEnd).to.have.lengthOf(initialUsers.length);
  });

  it('Email must be unique, if not - new user is not added', async () => {
    const newUser = {
      username: "Ordan",
      name: 'Dmitry Dornichev',
      password: 'iwannabeahero',
      phonenumber: '88654561256',
      email: 'my-emah@jjjjppp.com' // already in initialUsers
    };

    const result = await api
      .post(`${apiBaseUrl}/users`)
      .send(newUser)
      .expect(409);

    expect(result.body.error.name).to.equal('SequelizeUniqueConstraintError');
    expect(result.body.error.message).to.equal('Some internal DB constraints error or Sequelize error');

    expect(result.body.error.originalError).to.exist;

    const usersAtEnd = await User.findAll({});

    expect(usersAtEnd).to.have.lengthOf(initialUsers.length);
  });

  it('DB Validation checks for user work - incorrect user data fails', async () => {

    const newUserFail1 = {
      username: "Or", // len < 3
      name: 'Dm', // len < 3
      password: 'iwannabeahero',
      phonenumber: '8800', // len < 5, but fails regex too
      email: 'fk1sd', // len < minlength, but fails isEmail too
      birthdate: 'ohI`mNotADateSir!' // !isDate
    };

    const result1 = await api
      .post(`${apiBaseUrl}/users`)
      .send(newUserFail1)
      .expect(400);

    expect(result1.body.error.name).to.equal('SequelizeValidationError');
    expect(result1.body.error.message).to.equal('Some internal DB constraints error or Sequelize error');

    if (result1.body.error.name !== 'SequelizeValidationError') return;

    const validationError1 = result1.body.error.originalError as ValidationError;
    const errorMessages1 = validationError1.errors.map(error => error.message);

    expect(errorMessages1).to.have.members([
      'Validation len on username failed',
      'Validation len on name failed',
      'Validation len on phonenumber failed',
      'Validation is on phonenumber failed',
      'Validation is on email failed',
      'Validation len on email failed',
      'Validation isDate on birthdate failed'
    ]);

    const newUserFail2 = {
      username: "Василий", // Russian letters in username regex
      name: '_Dmitry', // Starts with _ regex
      password: 'iwannabeahero',
      phonenumber: '+7-(985)-(500)-32-45', // second -(500) prohibited regex
      email: 'fk@sd.ru', // correct
      birthdate: '23.07.2001 13:12' // !isDate
    };

    const result2 = await api
      .post(`${apiBaseUrl}/users`)
      .send(newUserFail2)
      .expect(400);

    expect(result2.body.error.name).to.equal('SequelizeValidationError');
    expect(result2.body.error.message).to.equal('Some internal DB constraints error or Sequelize error');

    if (result2.body.error.name !== 'SequelizeValidationError') return;

    const validationError2 = result2.body.error.originalError as ValidationError;
    const errorMessages2 = validationError2.errors.map(error => error.message);

    expect(errorMessages2).to.have.members([
      'Validation is on username failed',
      'Validation is on name failed',
      'Validation is on phonenumber failed',
      'Validation isDate on birthdate failed'
    ]);

    const newUserFail3 = {
      username: "_Vasiliy", // Starts with _ regex
      name: 'Василий_', // Ends with _, though russian letters welcome regex
      password: 'iwannabeahero',
      phonenumber: '+7-(985)-500-32-45-12', // just incorrect by regex
      email: 'f@d.u', // len < 6, regex
      birthdate: '2001-07-23_07:31:03.242Z' // !isDate
    };

    const result3 = await api
      .post(`${apiBaseUrl}/users`)
      .send(newUserFail3)
      .expect(400);

    expect(result3.body.error.name).to.equal('SequelizeValidationError');
    expect(result3.body.error.message).to.equal('Some internal DB constraints error or Sequelize error');

    if (result3.body.error.name !== 'SequelizeValidationError') return;

    const validationError3 = result3.body.error.originalError as ValidationError;
    const errorMessages3 = validationError3.errors.map(error => error.message);

    expect(errorMessages3).to.have.members([
      'Validation is on username failed',
      'Validation is on name failed',
      'Validation is on phonenumber failed',
      'Validation is on email failed',
      'Validation len on email failed',
      'Validation isDate on birthdate failed'
    ]);

    const usersAtEnd = await User.findAll({});

    expect(usersAtEnd).to.have.lengthOf(initialUsers.length);

  });

  it('Password must be longer than 5 symbols', async () => {
    const newUser = {
      username: 'Petro',
      name: 'Vasilenko Pyotr Ivanovich',
      password: 'iwbah',
      phonenumber: '89354652288',
      email: 'my-email.vah@jjjjppp.com',
      birthdate: '2001-07-23T07:31:03.242Z',
    };

    const result = await api
      .post(`${apiBaseUrl}/users`)
      .send(newUser)
      .expect(400);

    expect(result.body.error.name).to.equal('PasswordLengthError');
    expect(result.body.error.message).to.equal('Password must be longer than 5 symbols');

    const usersAtEnd = await User.findAll({});

    expect(usersAtEnd).to.have.lengthOf(initialUsers.length);

  });

  it('Bulk autogenerated users add', async () => {

    let added: number = 0;

    const usersInDb = await User.findAll({});

    const usernamesSet = new Set([...usersInDb.map(user => user.username)]);
    const phonenumbersSet = new Set([...usersInDb.map(user => user.phonenumber)]);
    const emailsSet = new Set([...usersInDb.map(user => user.email)]);

    for (let i = 0; i < 30; i++) {
      const newUser = {
        username: genCorrectUsername(minUsernameLen, maxUsernameLen),
        name: genCorrectName(minNameLen, maxNameLen),
        password: 'iwannabeahero',
        phonenumber: genCorrectPhonenumber(),
        email: genCorrectEmail(minEmailLen, maxEmailLen),
        birthdate: '2001-07-23T07:31:03.242Z',
      };

      if (
        usernamesSet.has(newUser.username)
        ||
        phonenumbersSet.has(newUser.phonenumber)
        ||
        emailsSet.has(newUser.email)
      ) {

        const result = await api
          .post(`${apiBaseUrl}/users`)
          .send(newUser)
          .expect(409);

        expect(result.body.error.name).to.equal('SequelizeUniqueConstraintError');
        expect(result.body.error.message).to.equal('Some internal DB constraints error or Sequelize error');

      } else {

        await api
          .post(`${apiBaseUrl}/users`)
          .send(newUser)
          .expect(201)
          .expect('Content-Type', /application\/json/);

        usernamesSet.add(newUser.username);
        phonenumbersSet.add(newUser.phonenumber);
        emailsSet.add(newUser.email);

        added++;

      }
    }

    const usersAtEnd = await User.findAll({});

    expect(usersAtEnd).to.have.lengthOf(initialUsers.length + added);

  }).timeout(30000);

  it('Bulk autogenerated users reject', async () => {

    for (let i = 0; i < 30; i++) {
      const newIncorrectGen = {
        username: genIncorrectString('username', usernameRegExp, minUsernameLen, maxUsernameLen),
        name: genIncorrectString('name', nameRegExp, minNameLen, maxNameLen),
        password: 'iwannabeahero',
        phonenumber: genIncorrectString('phonenumber', phonenumberRegExp, minPhonenumberLen, maxPhonenumberLen),
        email: genIncorrectString('email', emailRegExp, minEmailLen, maxEmailLen),
        birthdate: genIncorrectString('birthdate', dateRegExp, 1, 52),
      };

      const newUserIncorrect = {
        username: newIncorrectGen.username.result,
        name: newIncorrectGen.name.result,
        password: newIncorrectGen.password,
        phonenumber: newIncorrectGen.phonenumber.result,
        email: newIncorrectGen.email.result,
        birthdate: newIncorrectGen.birthdate.result
      };

      const errorsSet = new Set([
        ...newIncorrectGen.username.errors,
        ...newIncorrectGen.name.errors,
        ...newIncorrectGen.phonenumber.errors,
        ...newIncorrectGen.email.errors,
        ...newIncorrectGen.birthdate.errors
      ]);

      const result = await api
        .post(`${apiBaseUrl}/users`)
        .send(newUserIncorrect)
        .expect(400);

      expect(result.body.error.name).to.equal('SequelizeValidationError');
      expect(result.body.error.message).to.equal('Some internal DB constraints error or Sequelize error');

      if (result.body.error.name !== 'SequelizeValidationError') return;

      const validationError = result.body.error.originalError as ValidationError;
      const errorMessages = validationError.errors.map(error => error.message);

      expect(errorMessages).to.have.members(Array.from(errorsSet));

    }

    const usersAtEnd = await User.findAll({});

    expect(usersAtEnd).to.have.lengthOf(initialUsers.length);

  }).timeout(30000);

  it.only('Fast-check try', () => {

    // fc.assert(
    //   fc.property(fc.gen(), (g) => {
    //     const userA = {
    //       firstName: g(firstName),
    //       lastName: g(lastName),
    //       birthDate: g(birthDate),
    //     };
    //     const userB = {
    //       firstName: g(firstName),
    //       lastName: g(lastName),
    //       birthDate: g(birthDate, { strictlyOlderThan: userA.birthDate }),
    //     };
    //     expect(sortByAge([userA, userB])).toEqual([userA, userB]);
    //     expect(sortByAge([userB, userA])).toEqual([userA, userB]);
    //   })
    // );
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