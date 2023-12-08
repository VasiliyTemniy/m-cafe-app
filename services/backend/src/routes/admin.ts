import type { RequestHandler } from 'express';
import { Router } from 'express';
import { middleware } from '../utils/middleware.js';
import { fixedLocController, uiSettingController, userController } from '../controllers';


const adminRouter = Router();

adminRouter.get(
  '/user/',
  middleware.verifyToken.bind(middleware),
  middleware.userRightsExtractor.bind(middleware) as RequestHandler,
  middleware.adminCheck.bind(middleware),
  (async (req, res) => {

    await userController.getSome(req, res);

  }) as RequestHandler
);

adminRouter.get(
  '/user/:id',
  middleware.verifyToken.bind(middleware),
  middleware.userRightsExtractor.bind(middleware) as RequestHandler,
  middleware.adminCheck.bind(middleware),
  middleware.requestParamsCheck.bind(middleware),
  (async (req, res) => {

    await userController.getById(req, res);

  }) as RequestHandler
);

adminRouter.put(
  '/user/:id',
  middleware.verifyToken.bind(middleware),
  middleware.userRightsExtractor.bind(middleware) as RequestHandler,
  middleware.adminCheck.bind(middleware),
  middleware.requestParamsCheck.bind(middleware),
  (async (req, res) => {

    await userController.administrate(req, res);

  }) as RequestHandler
);

adminRouter.delete(
  '/user/:id',
  middleware.verifyToken.bind(middleware),
  middleware.userRightsExtractor.bind(middleware) as RequestHandler,
  middleware.adminCheck.bind(middleware),
  middleware.requestParamsCheck.bind(middleware),
  (async (req, res) => {

    await userController.delete(req, res);

  }) as RequestHandler
);

adminRouter.get(
  '/fixed-loc/reset',
  middleware.verifyToken.bind(middleware),
  middleware.userRightsExtractor.bind(middleware) as RequestHandler,
  middleware.superAdminCheck.bind(middleware) as RequestHandler,
  (async (req, res) => {

    await fixedLocController.reset(req, res);

  }) as RequestHandler
);

adminRouter.get(
  '/ui-setting/reset',
  middleware.verifyToken.bind(middleware),
  middleware.userRightsExtractor.bind(middleware) as RequestHandler,
  middleware.superAdminCheck.bind(middleware) as RequestHandler,
  (async (req, res) => {

    await uiSettingController.reset(req, res);

  }) as RequestHandler
);

export default adminRouter;