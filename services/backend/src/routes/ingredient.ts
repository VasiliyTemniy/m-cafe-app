import type { RequestHandler } from 'express';
import { Router } from 'express';
import { middleware } from '../utils/middleware.js';
import { ingredientController } from '../controllers/index.js';


const ingredientRouter = Router();

ingredientRouter.get(
  '/',
  middleware.verifyToken.bind(middleware),
  middleware.userRightsExtractor.bind(middleware) as RequestHandler,
  middleware.managerCheck.bind(middleware),
  (async (req, res) => {

    await ingredientController.getAll(req, res);

  }) as RequestHandler
);

ingredientRouter.get(
  '/:id',
  middleware.verifyToken.bind(middleware),
  middleware.userRightsExtractor.bind(middleware) as RequestHandler,
  middleware.managerCheck.bind(middleware),
  middleware.requestParamsCheck.bind(middleware),
  (async (req, res) => {

    await ingredientController.getById(req, res);

  }) as RequestHandler
);

ingredientRouter.post(
  '/',
  middleware.verifyToken.bind(middleware),
  middleware.userRightsExtractor.bind(middleware) as RequestHandler,
  middleware.adminCheck.bind(middleware),
  (async (req, res) => {

    await ingredientController.create(req, res);

  }) as RequestHandler
);

ingredientRouter.put(
  '/:id',
  middleware.verifyToken.bind(middleware),
  middleware.userRightsExtractor.bind(middleware) as RequestHandler,
  middleware.adminCheck.bind(middleware),
  middleware.requestParamsCheck.bind(middleware),
  (async (req, res) => {

    await ingredientController.update(req, res);

  }) as RequestHandler
);

ingredientRouter.delete(
  '/:id',
  middleware.verifyToken.bind(middleware),
  middleware.userRightsExtractor.bind(middleware) as RequestHandler,
  middleware.adminCheck.bind(middleware),
  middleware.requestParamsCheck.bind(middleware),
  (async (req, res) => {

    await ingredientController.remove(req, res);

  }) as RequestHandler
);

export default ingredientRouter;