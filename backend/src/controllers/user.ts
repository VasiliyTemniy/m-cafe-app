import bcryptjs from 'bcryptjs';
import { RequestHandler, Router } from 'express';
import models from '../models/index.js';
import { RequestBodyError } from '../types/errors.js';
import { isEditPasswordBody, isEditUserBody, isNewUserBody } from '../types/requestBodies.js';
import { isCustomRequest } from '../types/route.js';
import middleware from '../utils/middleware.js';

const User = models.User;

const usersRouter = Router();

usersRouter.post(
  '/',
  (async (req, res) => {

    if (!isNewUserBody(req.body)) throw new RequestBodyError('Invalid new user request body');

    const { username, name, password, phonenumber } = req.body;

    const existingUser = await User.findOne({
      where: {
        username: username
      }
    });
    if (existingUser) {
      return res.status(400).json({ error: 'username must be unique' });
    }

    if (password === undefined || password.length <= 3) {
      return res.status(400).json({ error: 'password must be longer than 3 symbols' });
    } else {
      const saltRounds = 10;
      const passwordHash = await bcryptjs.hash(password, saltRounds);

      const user = {
        username,
        name,
        passwordHash,
        phonenumber
      };

      const savedUser = await User.create(user);

      res.status(201).json(savedUser);
    }
  }) as RequestHandler
);

usersRouter.put(
  '/:id',
  middleware.verifyToken,
  middleware.userExtractor,
  middleware.sessionCheck,
  (async (req, res) => {

    if (!isEditUserBody(req.body)) throw new RequestBodyError('Invalid edit user request body');

    const { username, name, phonenumber } = req.body;

    if (isCustomRequest(req) && req.userId !== req.params.id) {
      return res.status(401).json({ error: 'User attempts to change another users data or invalid user id' });
    } else {

      const user = await User.findByPk(req.params.id);

      if (user) {
        user.username = username;
        user.name = name;
        user.phonenumber = phonenumber;

        await user.save();

        res.json(user);
      }
    }
  }) as RequestHandler
);

usersRouter.put(
  '/:id?passchange',
  middleware.verifyToken,
  middleware.userExtractor,
  middleware.sessionCheck,
  (async (req, res) => {

    if (!isEditPasswordBody(req.body)) throw new RequestBodyError('Invalid edit password request body');

    const { password, newPassword } = req.body;

    if (newPassword === undefined || newPassword.length <= 3) {
      return res
        .status(400)
        .json({ error: 'Username and password must be longer than 3 symbols' });
    } else {
      if (isCustomRequest(req) && req.userId !== req.params.id) {
        return res.status(401).json({ error: 'User attempts to change another users data or invalid user id' });
      } else {

        const user = await User.findByPk(req.params.id);
        const passwordCorrect =
          user === null ? false : await bcryptjs.compare(password, user.passwordHash);
  
        if (!(user && passwordCorrect)) {
          return res.status(401).json({
            error: 'invalid username or password',
          });
        }

        const saltRounds = 10;
        const newPasswordHash = await bcryptjs.hash(newPassword, saltRounds);

        if (user) {
          user.passwordHash = newPasswordHash;

          await user.save();

          res.json(user);
        }
      }
    }
  }) as RequestHandler
);

usersRouter.get(
  '/me',
  middleware.verifyToken,
  middleware.userExtractor,
  middleware.sessionCheck,
  (async (req, res) => {

    // let where = {};
    // if (req.query.read) {
    //   where = { read: req.query.read === 'true' };
    // }

    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['createdAt', 'updatedAt', 'passwordHash', 'disabled', 'admin'] }
    });

    if (user) {
      res.json(user);
    } else {
      throw new Error('No user entry');
    }
  }) as RequestHandler
);

export default usersRouter;