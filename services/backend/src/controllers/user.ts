import bcryptjs from 'bcryptjs';
import { RequestHandler, Router } from 'express';
import {
  CredentialsError,
  HackError,
  PasswordLengthError,
  RequestBodyError,
  UnknownError,
  isEditUserBody,
  isNewUserBody,
  UserTransit
} from '@m-cafe-app/utils';
import { isRequestWithUser } from '../types/RequestCustom.js';
import middleware from '../utils/middleware.js';
import { User } from '../models/index.js';
import { maxPasswordLen, minPasswordLen } from '../utils/constants.js';

const usersRouter = Router();

usersRouter.post(
  '/',
  (async (req, res) => {

    if (!isNewUserBody(req.body)) throw new RequestBodyError('Invalid new user request body');
    if (Object.prototype.hasOwnProperty.call(req.body, "admin")) throw new HackError('Please do not try this');

    const { username, name, password, phonenumber, email, birthdate } = req.body;

    if (password === undefined || !(minPasswordLen < password.length && password.length < maxPasswordLen))
      throw new PasswordLengthError(`Password must be longer than ${minPasswordLen} and shorter than ${maxPasswordLen} symbols`);

    const saltRounds = 10;
    const passwordHash = await bcryptjs.hash(password, saltRounds);

    const user = {
      username,
      name,
      passwordHash,
      phonenumber,
      email,
      birthdate: birthdate ? new Date(birthdate) : undefined
    };

    const savedUser = await User.create(user);

    const resBody: UserTransit = {
      id: savedUser.id,
      username: savedUser.username,
      name: savedUser.name,
      phonenumber: savedUser.phonenumber,
      email: savedUser.email,
      birthdate: savedUser.birthdate
    };

    res.status(201).json(resBody);

  }) as RequestHandler
);

usersRouter.put(
  '/:id',
  middleware.verifyToken,
  middleware.userExtractor,
  middleware.sessionCheck,
  (async (req, res) => {

    if (!isRequestWithUser(req)) throw new UnknownError('This code should never be reached - check userExtractor middleware');
    if (!isEditUserBody(req.body)) throw new RequestBodyError('Invalid edit user request body');
    if (req.userId !== Number(req.params.id)) throw new HackError('User attempts to change another users data or invalid user id');

    const { username, name, password, phonenumber, email, birthdate, newPassword } = req.body;

    const passwordCorrect = await bcryptjs.compare(password, req.user.passwordHash);

    if (!passwordCorrect) throw new CredentialsError('Password incorrect');

    if (username) req.user.username = username;
    if (name) req.user.name = name;
    if (phonenumber) req.user.phonenumber = phonenumber;
    if (email) req.user.email = email;
    if (birthdate) req.user.birthdate = new Date(birthdate);
    if (newPassword) {
      if (!(minPasswordLen < newPassword.length && newPassword.length < maxPasswordLen))
        throw new PasswordLengthError(`Password must be longer than ${minPasswordLen} and shorter than ${maxPasswordLen} symbols`);
      const saltRounds = 10;
      req.user.passwordHash = await bcryptjs.hash(newPassword, saltRounds);
    }

    await req.user.save();

    const resBody: UserTransit = {
      id: req.user.id,
      username: req.user.username,
      name: req.user.name,
      phonenumber: req.user.phonenumber,
      email: req.user.email,
      birthdate: req.user.birthdate
    };

    res.status(200).json(resBody);

  }) as RequestHandler
);

usersRouter.get(
  '/me',
  middleware.verifyToken,
  middleware.userExtractor,
  middleware.sessionCheck,
  ((req, res) => {

    if (!isRequestWithUser(req)) throw new UnknownError('This code should never be reached - check userExtractor middleware');

    const resBody: UserTransit = {
      id: req.user.id,
      username: req.user.username,
      name: req.user.name,
      phonenumber: req.user.phonenumber,
      email: req.user.email,
      birthdate: req.user.birthdate
    };

    res.status(200).json(resBody);

  }) as RequestHandler
);

export default usersRouter;