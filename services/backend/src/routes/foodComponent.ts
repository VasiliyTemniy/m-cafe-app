import type { RequestHandler } from 'express';
import { Router } from 'express';
import { middleware } from '../utils/middleware.js';
import { foodComponentController } from '../controllers/index.js';


const foodComponentRouter = Router();

/**
 * Path to get all food components
 */
foodComponentRouter.get(
  '/:id/components',
  middleware.requestParamsCheck.bind(middleware),
  (async (req, res) => {

    await foodComponentController.getByFoodId(req, res);

  }) as RequestHandler
);

/**
 * Path to add new food components
 */
foodComponentRouter.post(
  '/:id/components',
  middleware.verifyToken.bind(middleware),
  middleware.userRightsExtractor.bind(middleware) as RequestHandler,
  middleware.adminCheck.bind(middleware),
  middleware.requestParamsCheck.bind(middleware),
  (async (req, res) => {

    await foodComponentController.createMany(req, res);

  }) as RequestHandler
);

/**
 * Path to rewrite all food components at once
 */
foodComponentRouter.put(
  '/:id/components',
  middleware.verifyToken.bind(middleware),
  middleware.userRightsExtractor.bind(middleware) as RequestHandler,
  middleware.adminCheck.bind(middleware),
  middleware.requestParamsCheck.bind(middleware),
  (async (req, res) => {

    await foodComponentController.rewriteAllForOneFood(req, res);

  }) as RequestHandler
);

/**
 * Path to update one food component
 */
foodComponentRouter.put(
  '/:id/components/:foodComponentId',
  middleware.verifyToken.bind(middleware),
  middleware.userRightsExtractor.bind(middleware) as RequestHandler,
  middleware.adminCheck.bind(middleware),
  middleware.requestParamsCheck.bind(middleware),
  (async (req, res) => {

    await foodComponentController.update(req, res);

  }) as RequestHandler
);

/**
 * Path to delete all food components for particular food
 */
foodComponentRouter.delete(
  '/:id/components',
  middleware.verifyToken.bind(middleware),
  middleware.userRightsExtractor.bind(middleware) as RequestHandler,
  middleware.adminCheck.bind(middleware),
  middleware.requestParamsCheck.bind(middleware),
  (async (req, res) => {

    await foodComponentController.removeAllForOneFood(req, res);

  }) as RequestHandler
);

/**
 * Path to delete one food component
 */
foodComponentRouter.delete(
  '/:id/components/:foodComponentId',
  middleware.verifyToken.bind(middleware),
  middleware.userRightsExtractor.bind(middleware) as RequestHandler,
  middleware.adminCheck.bind(middleware),
  middleware.requestParamsCheck.bind(middleware),
  (async (req, res) => {

    await foodComponentController.remove(req, res);

  }) as RequestHandler
);

export default foodComponentRouter;