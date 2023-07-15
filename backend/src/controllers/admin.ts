import { Router, RequestHandler } from 'express';
import models from '../models/index.js';
import { RequestBodyError } from '../types/errors.js';
import { isDisableUserBody } from '../types/requestBodies.js';
import { isCustomRequest } from '../types/route.js';
import middleware from '../utils/middleware.js';

const { User, Session } = models;

const adminRouter = Router();

adminRouter.get(
  '/users/',
  (async (req, res) => {

    const users = await User.findAll({
      attributes: { exclude: ['createdAt', 'updatedAt', 'passwordHash', 'disabled', 'admin'] },
      include: [
        {
          // model: Blog,
          attributes: { exclude: ['userId', 'createdAt', 'updatedAt'] }
        }
      ],
    });

    res.json(users);
  }) as RequestHandler
);

adminRouter.get(
  '/users/:id',
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

adminRouter.put(
  '/users/:id',
  middleware.verifyToken,
  middleware.userExtractor,
  middleware.sessionCheck,
  (async (req, res) => {

    if (isCustomRequest(req) && req.user && isDisableUserBody(req.body)) {
      const userAdmin = req.user;

      if (!userAdmin.admin) {
        res.status(403).json({ error: 'You have no admin permissions' });
      }

      const userSubject = await User.scope('all').findByPk(req.params.id);

      if (!userSubject) {
        res.status(403).json({ error: `No user entry with this id ${req.params.id}` });
      } else {
        userSubject.disabled = req.body.disable;

        if (userSubject.disabled) {
          await Session.destroy({
            where: {
              userId: userSubject.id,
            }
          });
        }

        await userSubject.save();
        res.json(userSubject);
      }

    } else {
      throw new RequestBodyError('Invalid disable user request body');
    }
    
  }) as RequestHandler
);

export default adminRouter;