import type { RequestHandler } from 'express';
import { Router } from 'express';
import { middleware } from '../utils/middleware.js';
import { foodTypeController } from '../controllers';


const foodTypeRouter = Router();

foodTypeRouter.get(
  '/',
  (async (req, res) => {

    await foodTypeController.getAll(req, res);

  }) as RequestHandler
);

foodTypeRouter.get(
  '/:id',
  middleware.requestParamsCheck.bind(middleware),
  (async (req, res) => {

    await foodTypeController.getById(req, res);

  }) as RequestHandler
);

foodTypeRouter.post(
  '/',
  middleware.verifyToken.bind(middleware),
  middleware.userRightsExtractor.bind(middleware) as RequestHandler,
  middleware.adminCheck.bind(middleware),
  (async (req, res) => {

    await foodTypeController.create(req, res);

  }) as RequestHandler
);

foodTypeRouter.put(
  '/:id',
  middleware.verifyToken.bind(middleware),
  middleware.userRightsExtractor.bind(middleware) as RequestHandler,
  middleware.adminCheck.bind(middleware),
  middleware.requestParamsCheck.bind(middleware),
  (async (req, res) => {

    await foodTypeController.update(req, res);

  }) as RequestHandler
);

foodTypeRouter.delete(
  '/:id',
  middleware.verifyToken.bind(middleware),
  middleware.userRightsExtractor.bind(middleware) as RequestHandler,
  middleware.adminCheck.bind(middleware),
  middleware.requestParamsCheck.bind(middleware),
  (async (req, res) => {

    await foodTypeController.remove(req, res);

  }) as RequestHandler
);

export default foodTypeRouter;