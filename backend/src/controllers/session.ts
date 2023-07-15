import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import { RequestHandler, Router } from 'express';
import models from '../models/index.js';
import middleware from '../utils/middleware.js';
import config from '../utils/config.js';
import { isCustomRequest } from '../types/route.js';
import { RequestBodyError } from '../types/errors.js';
import { isLoginBody } from '../types/requestBodies.js';

const sessionRouter = Router();
const { User, Session } = models;

sessionRouter.post(
  '/',
  (async (req, res) => {

    if (!isLoginBody(req.body)) throw new RequestBodyError('Invalid login request body');

    const { username, password } = req.body;

    const user = await User.scope('all').findOne({
      where: {username: username}
    });
    const passwordCorrect =
      user === null ? false : await bcryptjs.compare(password, user.passwordHash);

    if (!(user && passwordCorrect)) {
      return res.status(401).json({
        error: 'invalid username or password',
      });
    } else if (user.disabled) {
      return res.status(401).json({
        error: 'Your account have been banned. Contact admin to unblock account',
      });
    }

    const userForToken = {
      username: user.username,
      id: user.id,
    };

    const token = jwt.sign(userForToken, config.SECRET, { expiresIn: config.TOKEN_TTL });

    const session = {
      userId: user.id,
      token
    };

    await Session.create(session);

    res.status(200).send({ token, username: user.username, name: user.name, id: userForToken.id });
  }) as RequestHandler
);

sessionRouter.delete(
  '/',
  middleware.verifyToken,
  middleware.userExtractor,
  (async (req, res) => {

    if (isCustomRequest(req) && req.userId && req.token) {
      await Session.destroy({
        where: {
          userId: req.userId,
          token: req.token
        }
      });
    }

    res.status(204).end();
  }) as RequestHandler
);

export default sessionRouter;