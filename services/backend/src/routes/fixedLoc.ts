import type { RequestHandler } from 'express';
import { Router } from 'express';
import { middleware } from '../utils/middleware.js';
import { fixedLocController } from '../controllers';


const fixedLocRouter = Router();

fixedLocRouter.get(
  '/',
  middleware.setVerifyOptional.bind(middleware),
  middleware.verifyToken.bind(middleware),
  middleware.userRightsExtractor.bind(middleware) as RequestHandler,
  (async (req, res) => {

    await fixedLocController.getByScope(req, res);

  }) as RequestHandler
);

fixedLocRouter.get(
  '/:id',
  middleware.setVerifyOptional.bind(middleware),
  middleware.verifyToken.bind(middleware),
  middleware.userRightsExtractor.bind(middleware) as RequestHandler,
  middleware.requestParamsCheck.bind(middleware),
  (async (req, res) => {

    await fixedLocController.getById(req, res);

  }) as RequestHandler
);

fixedLocRouter.put(
  '/all',
  middleware.verifyToken.bind(middleware),
  middleware.userRightsExtractor.bind(middleware) as RequestHandler,
  middleware.adminCheck.bind(middleware),
  middleware.requestParamsCheck.bind(middleware),
  (async (req, res) => {

    await fixedLocController.updateMany(req, res);

  }) as RequestHandler
);

fixedLocRouter.put(
  '/:id',
  middleware.verifyToken.bind(middleware),
  middleware.userRightsExtractor.bind(middleware) as RequestHandler,
  middleware.adminCheck.bind(middleware),
  middleware.requestParamsCheck.bind(middleware),
  (async (req, res) => {

    await fixedLocController.update(req, res);

  }) as RequestHandler
);

export default fixedLocRouter;