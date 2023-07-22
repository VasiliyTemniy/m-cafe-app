import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import { RequestHandler, Router } from 'express';
import middleware from '../utils/middleware.js';
import config from '../utils/config.js';
import { isCustomRequest } from '../types/RequestCustom.js';
import { RequestBodyError, CredentialsError, BannedError, UnknownError } from '@m-cafe-app/utils';
import { isLoginBody } from '@m-cafe-app/utils';
import { User, Session } from '../models/index.js';

const sessionRouter = Router();

sessionRouter.post(
  '/',
  (async (req, res) => {

    if (!isLoginBody(req.body)) throw new RequestBodyError('Invalid login request body');

    const { username, phonenumber, password } = req.body;
    const userAgent = req.headers['user-agent'] ? req.headers['user-agent'] : 'unknown';

    const user = username
      ? await User.scope('all').findOne({
        where: { username: username }
      })
      : await User.scope('all').findOne({
        where: { phonenumber: phonenumber }
      });

    const passwordCorrect =
      user === null ? false : await bcryptjs.compare(password, user.passwordHash);

    if (!(user && passwordCorrect)) {
      throw new CredentialsError('Invalid username or password');
    } else if (user.disabled) {
      throw new BannedError('Your account have been banned. Contact admin to unblock account');
    }

    const activeSession = await Session.findOne({
      where: {
        userId: user.id,
        userAgent
      }
    });

    const userForToken = {
      username: user.username,
      id: user.id,
    };

    const token = jwt.sign(userForToken, config.SECRET, { expiresIn: config.TOKEN_TTL });

    if (!activeSession) {

      const session = {
        userId: user.id,
        token,
        userAgent
      };

      await Session.create(session);

    }

    res.status(200).send({
      token,
      username: user.username,
      name: user.name,
      id: userForToken.id
    });

  }) as RequestHandler
);

sessionRouter.delete(
  '/',
  middleware.verifyToken,
  middleware.userExtractor,
  (async (req, res) => {

    if (!isCustomRequest(req)) throw new UnknownError('This code should never be reached');

    await Session.destroy({
      where: {
        userId: req.userId,
        token: req.token
      }
    });

    res.status(204).end();

  }) as RequestHandler
);

export default sessionRouter;