import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import { RequestHandler, Router } from 'express';
import middleware from '../utils/middleware.js';
import config from '../utils/config.js';
import { isRequestCustom, isRequestWithUser } from '../types/RequestCustom.js';
import {
  RequestBodyError,
  CredentialsError,
  BannedError,
  UnknownError,
  SessionError,
  ProhibitedError,
  mapToRedisStrings
} from '@m-cafe-app/utils';
import { isLoginBody } from '@m-cafe-app/utils';
import { User } from '../models/index.js';
import { Session } from '../redis/Session.js';
import { timestampsKeys } from '@m-cafe-app/utils';

const sessionRouter = Router();

sessionRouter.post(
  '/',
  (async (req, res) => {

    if (!isLoginBody(req.body)) throw new RequestBodyError('Invalid login request body');
    if (req.body.phonenumber === config.SUPERADMIN_PHONENUMBER) throw new ProhibitedError('Superadmin must login only with a username');

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
      throw new CredentialsError('Invalid login or password');
    } else if (user.rights === 'disabled') {
      throw new BannedError('Your account have been banned. Contact admin to unblock account');
    }

    const activeSession = await Session.findOne({
      where: {
        userId: user.id,
        userAgent
      }
    });


    // Rand property is used to make sure that no similar tokens are created while no time passed
    // Crucial for session tests
    const token = jwt.sign({
      id: user.id,
      rand: Math.random() * 10000
    }, config.SECRET, { expiresIn: config.TOKEN_TTL });


    // Save user transit data to cache for further session checks, user disability/admin checks
    // const userToCache = mapToRedisStrings(user.dataValues, { omit: ['passwordHash', ...timestampsKeys] });
    const userToCache = mapToRedisStrings(user.dataValues, { omit: ['passwordHash'] });


    // If there is no active session in this agent, create new one
    // If there is one - update token
    if (!activeSession) {

      const session = {
        userId: user.id,
        token,
        userAgent
      };

      // await Session.create(session);  <-- to use with postgre Session
      await Session.create(session, userToCache);

    } else {

      activeSession.token = token;

      // await activeSession.save();  <-- to use with postgre Session
      await activeSession.save(userToCache);

    }

    res.status(201).send({
      token,
      id: user.id
    });

  }) as RequestHandler
);

sessionRouter.get(
  '/refresh',
  middleware.verifyToken,
  middleware.userExtractor,
  (async (req, res) => {

    if (!isRequestWithUser(req)) throw new UnknownError('This code should never be reached - check userExtractor middleware');

    const userAgent = req.headers['user-agent'] ? req.headers['user-agent'] : 'unknown';

    const activeSession = await Session.findOne({
      where: {
        userId: req.userId,
        token: req.token,
        userAgent
      }
    });

    if (!activeSession) throw new SessionError('Invalid login request body');

    const token = jwt.sign({
      id: req.userId,
      rand: Math.random() * 10000
    }, config.SECRET, { expiresIn: config.TOKEN_TTL });

    // Save user transit data to cache for further session checks, user disability/admin checks
    // const userToCache = mapToRedisStrings(req.user.dataValues, { omit: ['passwordHash', ...timestampsKeys] });
    const userToCache = mapToRedisStrings(req.user.dataValues, { omit: ['passwordHash', ...timestampsKeys] });

    activeSession.token = token;

    await activeSession.save(userToCache);

    res.status(200).send({
      token,
      id: req.userId
    });

  }) as RequestHandler
);

sessionRouter.delete(
  '/',
  middleware.verifyToken,
  middleware.userCheck,
  (async (req, res) => {

    if (!isRequestCustom(req)) throw new UnknownError('This code should never be reached - check verifyToken middleware');

    const userAgent = req.headers['user-agent'] ? req.headers['user-agent'] : 'unknown';

    await Session.destroy({
      where: {
        userId: req.userId,
        token: req.token,
        userAgent
      }
    });

    res.status(204).end();

  }) as RequestHandler
);

export default sessionRouter;