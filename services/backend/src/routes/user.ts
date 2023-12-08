import type { RequestHandler } from 'express';
import { Router } from 'express';
import { middleware } from '../utils/middleware.js';
import { userController } from '../controllers';

const usersRouter = Router();

usersRouter.post(
  '/',
  (async (req, res) => {

    await userController.create(req, res);

  }) as RequestHandler
);

usersRouter.put(
  '/:id',
  middleware.verifyToken.bind(middleware),
  middleware.userRightsExtractor.bind(middleware) as RequestHandler,
  middleware.requestParamsCheck.bind(middleware),
  (async (req, res) => {

    await userController.update(req, res);

  }) as RequestHandler
);

usersRouter.delete(
  '/',
  middleware.verifyToken.bind(middleware),
  middleware.userRightsExtractor.bind(middleware) as RequestHandler,
  (async (req, res) => {

    await userController.remove(req, res);

  }) as RequestHandler
);


usersRouter.post(
  '/address',
  middleware.verifyToken.bind(middleware),
  middleware.userRightsExtractor.bind(middleware) as RequestHandler,
  (async (req, res) => {

    await userController.createAddress(req, res);

  }) as RequestHandler
);

usersRouter.put(
  '/address/:id',
  middleware.verifyToken.bind(middleware),
  middleware.userRightsExtractor.bind(middleware) as RequestHandler,
  middleware.requestParamsCheck.bind(middleware),
  (async (req, res) => {

    await userController.updateAddress(req, res);

  }) as RequestHandler
);

usersRouter.delete(
  '/address/:id',
  middleware.verifyToken.bind(middleware),
  middleware.userRightsExtractor.bind(middleware) as RequestHandler,
  middleware.requestParamsCheck.bind(middleware),
  (async (req, res) => {

    await userController.removeAddress(req, res);

  }) as RequestHandler
);


usersRouter.get(
  '/me',
  middleware.verifyToken.bind(middleware),
  middleware.userRightsExtractor.bind(middleware) as RequestHandler,
  (async (req, res) => {

    await userController.getSelfWithAssociations(req, res);

  }) as RequestHandler
);


export default usersRouter;