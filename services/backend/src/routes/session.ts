import type { RequestHandler } from 'express';
import { Router } from 'express';
import { middleware } from '../utils/middleware.js';
import { userController } from '../controllers';

const sessionRouter = Router();

sessionRouter.post(
  '/',
  (async (req, res) => {

    await userController.login(req, res);

  }) as RequestHandler
);

sessionRouter.get(
  '/refresh',
  middleware.verifyToken.bind(middleware),
  (async (req, res) => {

    await userController.refreshToken(req, res);

  }) as RequestHandler
);

sessionRouter.delete(
  '/',
  middleware.verifyToken.bind(middleware),
  (async (req, res) => {

    await userController.logout(req, res);

  }) as RequestHandler
);

export default sessionRouter;