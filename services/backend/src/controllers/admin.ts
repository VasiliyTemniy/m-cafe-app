import { Router, RequestHandler } from 'express';
import { DatabaseError, hasOwnProperty, ProhibitedError, RequestBodyError, RequestQueryError } from '@m-cafe-app/utils';
import { isAdministrateUserBody } from '@m-cafe-app/utils';
import middleware from '../utils/middleware.js';
import { User } from '@m-cafe-app/db';
import { Session } from '../redis/Session.js';
import config from '../utils/config.js';
import { possibleUserRights } from '../utils/constants.js';

const adminRouter = Router();

adminRouter.get(
  '/users/',
  middleware.verifyToken,
  middleware.adminCheck,
  middleware.sessionCheck,
  (async (req, res) => {

    let limit = 20;
    let offset = 0;

    if (req.query.limit) {
      if (isNaN(Number(req.query.limit))) throw new RequestQueryError('Incorrect query string');
      limit = Number(req.query.limit);
    }

    if (req.query.offset) {
      if (isNaN(Number(req.query.offset))) throw new RequestQueryError('Incorrect query string');
      offset = Number(req.query.offset);
    }

    const userSubjects = await User.scope('all').findAll({
      attributes: { exclude: ['passwordHash'] },
      limit,
      offset
    });

    res.status(200).json(userSubjects);

  }) as RequestHandler
);

adminRouter.get(
  '/users/:id',
  middleware.verifyToken,
  middleware.adminCheck,
  middleware.sessionCheck,
  middleware.requestParamsCheck,
  (async (req, res) => {

    const userSubject = await User.scope('all').findByPk(req.params.id, {
      attributes: { exclude: ['passwordHash'] }
    });

    if (!userSubject) throw new DatabaseError(`No user entry with this id ${req.params.id}`);

    res.status(200).json(userSubject);

  }) as RequestHandler
);

adminRouter.put(
  '/users/:id',
  middleware.verifyToken,
  middleware.adminCheck,
  middleware.sessionCheck,
  middleware.requestParamsCheck,
  (async (req, res) => {

    if (!isAdministrateUserBody(req.body)) throw new RequestBodyError('Invalid administrate user request body');

    const userSubject = await User.scope('all').findByPk(req.params.id, { paranoid: false });

    if (!userSubject) throw new DatabaseError(`No user entry with this id ${req.params.id}`);
    if (userSubject.phonenumber === config.SUPERADMIN_PHONENUMBER)
      throw new ProhibitedError('Attempt to alter superadmin');

    if (hasOwnProperty(req.body, 'rights')) {
      if (possibleUserRights.includes(req.body.rights!))
        userSubject.rights = req.body.rights!;

      if (userSubject.rights === 'disabled') {
        await Session.destroy({
          where: {
            userId: userSubject.id,
          }
        });
      }
    }

    if (hasOwnProperty(req.body, 'restore') && req.body.restore) {
      await userSubject.restore();
    }

    await userSubject.save();

    res.status(200).json(userSubject);

  }) as RequestHandler
);

adminRouter.delete(
  '/users/:id',
  middleware.verifyToken,
  middleware.adminCheck,
  middleware.sessionCheck,
  middleware.requestParamsCheck,
  (async (req, res) => {

    const userSubject = await User.scope('all').findByPk(req.params.id, { paranoid: false });

    if (!userSubject) throw new DatabaseError(`No user entry with this id ${req.params.id}`);
    if (!userSubject.deletedAt) throw new ProhibitedError('Only voluntarily deleted users can be fully removed by admins');

    await userSubject.destroy({ force: true });

    res.status(204).end();

  }) as RequestHandler
);

export default adminRouter;