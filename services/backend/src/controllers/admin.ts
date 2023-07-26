import { Router, RequestHandler } from 'express';
import { DatabaseError, ProhibitedError, RequestBodyError, UnknownError } from '@m-cafe-app/utils';
import { isDisableUserBody } from '@m-cafe-app/utils';
import { isCustomRequest } from '../types/RequestCustom.js';
import middleware from '../utils/middleware.js';
import { User, Session } from '../models/index.js';

const adminRouter = Router();

adminRouter.get(
  '/users/',
  middleware.verifyToken,
  middleware.sessionCheck,
  (async (req, res) => {

    if (!isCustomRequest(req)) throw new UnknownError('This code should never be reached');

    const userAdmin = req.user;

    if (!userAdmin.admin) throw new ProhibitedError('You have no admin permissions');

    const userSubjects = await User.findAll({
      attributes: { exclude: ['createdAt', 'updatedAt', 'passwordHash', 'disabled', 'admin'] },
      include: [
        {
          attributes: { exclude: ['userId', 'createdAt', 'updatedAt'] }
        }
      ],
    });

    res.status(200).json(userSubjects);

  }) as RequestHandler
);

adminRouter.get(
  '/users/:id',
  middleware.verifyToken,
  middleware.sessionCheck,
  (async (req, res) => {

    if (!isCustomRequest(req)) throw new UnknownError('This code should never be reached');

    const userAdmin = req.user;

    if (!userAdmin.admin) throw new ProhibitedError('You have no admin permissions');

    const userSubject = await User.findByPk(req.params.id, {
      attributes: { exclude: ['createdAt', 'updatedAt', 'passwordHash', 'disabled', 'admin'] }
    });

    if (!userSubject) throw new DatabaseError(`No user entry with this id ${req.params.id}`);

    res.status(200).json(userSubject);

  }) as RequestHandler
);

adminRouter.put(
  '/users/:id',
  middleware.verifyToken,
  middleware.sessionCheck,
  (async (req, res) => {

    if (!isCustomRequest(req)) throw new UnknownError('This code should never be reached');
    if (!isDisableUserBody(req.body)) throw new RequestBodyError('Invalid disable user request body');

    const userAdmin = req.user;

    if (!userAdmin.admin) throw new ProhibitedError('You have no admin permissions');

    const userSubject = await User.scope('all').findByPk(req.params.id);

    if (!userSubject) throw new DatabaseError(`No user entry with this id ${req.params.id}`);

    userSubject.disabled = req.body.disable;

    if (userSubject.disabled) {
      await Session.destroy({
        where: {
          userId: userSubject.id,
        }
      });
    }

    await userSubject.save();

    res.status(200).json(userSubject);

  }) as RequestHandler
);

export default adminRouter;