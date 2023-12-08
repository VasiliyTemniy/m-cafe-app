import type { RequestHandler } from 'express';
import { Router } from 'express';
import { middleware } from '../utils/middleware.js';
import { uiSettingController } from '../controllers';



const uiSettingRouter = Router();

uiSettingRouter.get(
  '/',
  middleware.setVerifyOptional.bind(middleware),
  middleware.verifyToken.bind(middleware),
  middleware.userRightsExtractor.bind(middleware) as RequestHandler,
  (async (req, res) => {

    await uiSettingController.getByScope(req, res);

  }) as RequestHandler
);

uiSettingRouter.get(
  '/:id',
  middleware.verifyToken.bind(middleware),
  middleware.userRightsExtractor.bind(middleware) as RequestHandler,
  middleware.adminCheck.bind(middleware),
  (async (req, res) => {

    await uiSettingController.getById(req, res);

  }) as RequestHandler
);

uiSettingRouter.put(
  '/all',
  middleware.verifyToken.bind(middleware),
  middleware.userRightsExtractor.bind(middleware) as RequestHandler,
  middleware.adminCheck.bind(middleware),
  middleware.requestParamsCheck.bind(middleware),
  (async (req, res) => {

    await uiSettingController.updateMany(req, res);

  }) as RequestHandler
);

uiSettingRouter.put(
  '/:id',
  middleware.verifyToken.bind(middleware),
  middleware.userRightsExtractor.bind(middleware) as RequestHandler,
  middleware.adminCheck.bind(middleware),
  middleware.requestParamsCheck.bind(middleware),
  (async (req, res) => {

    await uiSettingController.update(req, res);

  }) as RequestHandler
);

export default uiSettingRouter;