import type { RequestHandler } from 'express';
import { UnknownError } from '@m-cafe-app/utils';
import { Router } from 'express';
import middleware from '../utils/middleware.js';
import { isRequestWithUserRights } from '../types/RequestCustom.js';
import { uiSettingController } from '../controllers';



const uiSettingRouter = Router();

uiSettingRouter.get(
  '/',
  middleware.setVerifyOptional,
  middleware.verifyToken,
  middleware.userRightsExtractor,
  (async (req, res) => {

    if (!isRequestWithUserRights(req)) throw new UnknownError('This code should never be reached - check userRightsExtractor middleware');

    await uiSettingController.getByScope(req, res);

  }) as RequestHandler
);

uiSettingRouter.get(
  '/:id',
  middleware.verifyToken,
  middleware.adminCheck,
  middleware.sessionCheck,
  (async (req, res) => {

    await uiSettingController.getById(req, res);

  }) as RequestHandler
);

uiSettingRouter.put(
  '/all',
  middleware.verifyToken,
  middleware.adminCheck,
  middleware.sessionCheck,
  middleware.requestParamsCheck,
  (async (req, res) => {

    await uiSettingController.updateMany(req, res);

  }) as RequestHandler
);

uiSettingRouter.put(
  '/:id',
  middleware.verifyToken,
  middleware.adminCheck,
  middleware.sessionCheck,
  middleware.requestParamsCheck,
  (async (req, res) => {

    await uiSettingController.update(req, res);

  }) as RequestHandler
);

export default uiSettingRouter;