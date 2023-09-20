import type { UserDT } from '@m-cafe-app/utils';
import type { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import { Router } from 'express';
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
  mapDataToTransit,
  isLoginBody
} from '@m-cafe-app/utils';
import { User } from '@m-cafe-app/db';
import { Session } from '../redis/Session.js';

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

    if (!(user && passwordCorrect))
      throw new CredentialsError('Invalid login or password');
    if (user.rights === 'disabled')
      throw new BannedError('Your account have been banned. Contact admin to unblock account');
    if (user.deletedAt)
      throw new ProhibitedError('You have deleted your own account. To delete it permanently or restore it, contact admin');

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


    // If there is no active session in this agent, create new one
    // If there is one - update token
    if (!activeSession) {

      const session = {
        userId: user.id,
        token,
        userAgent
      };

      // await Session.create(session);  <-- to use with postgre Session
      await Session.create(session, user.rights);

    } else {

      activeSession.token = token;

      // await activeSession.save();  <-- to use with postgre Session
      await activeSession.save(user.rights);

    }

    const resBody: UserDT = mapDataToTransit(user.dataValues, { omit: ['passwordHash'] });

    res
      .cookie('token', token, {
        ...config.sessionCookieOptions,
        expires: new Date(Date.now() + config.cookieExpiracyMS)
      })
      .status(201).json(resBody);

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

    if (!activeSession) throw new SessionError('Session is not active. Please, relogin');

    const token = jwt.sign({
      id: req.userId,
      rand: Math.random() * 10000
    }, config.SECRET, { expiresIn: config.TOKEN_TTL });


    activeSession.token = token;

    await activeSession.save(req.user.rights);

    const resBody: UserDT = mapDataToTransit(req.user.dataValues, { omit: ['passwordHash'] });

    res
      .cookie('token', token, {
        ...config.sessionCookieOptions,
        expires: new Date(Date.now() + config.cookieExpiracyMS)
      })
      .status(200).json(resBody);

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

    res.clearCookie('token', config.sessionCookieOptions).status(204).end();

  }) as RequestHandler
);

export default sessionRouter;