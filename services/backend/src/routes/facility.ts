import type { RequestHandler } from 'express';
import { Router } from 'express';
import { middleware } from '../utils/middleware.js';
import { facilityController } from '../controllers/index.js';


const facilityRouter = Router();

facilityRouter.get(
  '/',
  (async (req, res) => {

    await facilityController.getAll(req, res);

  }) as RequestHandler
);

facilityRouter.get(
  '/:id',
  middleware.verifyToken.bind(middleware),
  middleware.userRightsExtractor.bind(middleware) as RequestHandler,
  middleware.adminCheck.bind(middleware),
  middleware.requestParamsCheck.bind(middleware),
  (async (req, res) => {

    await facilityController.getByIdWithAssociations(req, res);

  }) as RequestHandler
);

facilityRouter.post(
  '/:id/managers',
  middleware.verifyToken.bind(middleware),
  middleware.userRightsExtractor.bind(middleware) as RequestHandler,
  middleware.adminCheck.bind(middleware),
  middleware.requestParamsCheck.bind(middleware),
  (async (req, res) => {

    await facilityController.addManagers(req, res);

  }) as RequestHandler
);

facilityRouter.post(
  '/:id/stocks',
  middleware.verifyToken.bind(middleware),
  middleware.userRightsExtractor.bind(middleware) as RequestHandler,
  middleware.managerCheck.bind(middleware),
  middleware.requestParamsCheck.bind(middleware),
  (async (req, res) => {

    await facilityController.createManyStocks(req, res);

  }) as RequestHandler
);

facilityRouter.post(
  '/',
  middleware.verifyToken.bind(middleware),
  middleware.userRightsExtractor.bind(middleware) as RequestHandler,
  middleware.adminCheck.bind(middleware),
  middleware.requestParamsCheck.bind(middleware),
  (async (req, res) => {

    await facilityController.create(req, res);

  }) as RequestHandler
);

facilityRouter.put(
  '/:id/stocks',
  middleware.verifyToken.bind(middleware),
  middleware.userRightsExtractor.bind(middleware) as RequestHandler,
  middleware.managerCheck.bind(middleware),
  middleware.requestParamsCheck.bind(middleware),
  (async (req, res) => {

    await facilityController.updateManyStocks(req, res);

  }) as RequestHandler
);

facilityRouter.put(
  '/:id',
  middleware.verifyToken.bind(middleware),
  middleware.userRightsExtractor.bind(middleware) as RequestHandler,
  middleware.adminCheck.bind(middleware),
  middleware.requestParamsCheck.bind(middleware),
  (async (req, res) => {

    await facilityController.update(req, res);

  }) as RequestHandler
);

facilityRouter.delete(
  '/:id/managers',
  middleware.verifyToken.bind(middleware),
  middleware.userRightsExtractor.bind(middleware) as RequestHandler,
  middleware.adminCheck.bind(middleware),
  middleware.requestParamsCheck.bind(middleware),
  (async (req, res) => {

    await facilityController.removeManagers(req, res);

  }) as RequestHandler
);

facilityRouter.delete(
  '/:id',
  middleware.verifyToken.bind(middleware),
  middleware.userRightsExtractor.bind(middleware) as RequestHandler,
  middleware.adminCheck.bind(middleware),
  middleware.requestParamsCheck.bind(middleware),
  (async (req, res) => {

    await facilityController.remove(req, res);

  }) as RequestHandler
);

export default facilityRouter;