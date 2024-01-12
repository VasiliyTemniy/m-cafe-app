import type { RequestHandler } from 'express';
import { Router } from 'express';
import { middleware } from '../utils/middleware.js';
import { orderController } from '../controllers/index.js';


const orderRouter = Router();

/**
 * Path to get some orders with query\
 * Query example: ?limit=10&offset=5&userId=1&status=1&facilityId=1&paymentMethod=1&paymentStatus=1\
 * For customers, userId is necessary\
 * For managers, facilityId is necessary
 */
orderRouter.get(
  '/',
  middleware.verifyToken.bind(middleware),
  middleware.userRightsExtractor.bind(middleware) as RequestHandler,
  // Checks for user rights must be handled in orderController
  (async (req, res) => {

    await orderController.getSome(req, res);

    // Move this to frontend???
    // if (req.query.delayed) {
    //   if (isNaN(Number(req.query.delayed))) throw new RequestQueryError('Incorrect query string');
    //   where[Op.or] = [
    //     {
    //       status: { [Op.eq]: 'accepted' },
    //       deliverAt: { [Op.lt]: new Date(Date.now() + delayedStatusMS.accepted) }
    //     },
    //     {
    //       status: { [Op.eq]: 'cooking' },
    //       deliverAt: { [Op.lt]: new Date(Date.now() + delayedStatusMS.cooking) }
    //     },
    //     {
    //       status: { [Op.eq]: 'delivering' },
    //       deliverAt: { [Op.lt]: new Date(Date.now() + delayedStatusMS.delivering) }
    //     },
    //   ];
    // }

  }) as RequestHandler
);

/**
 * Path to get one order with query\
 * Query example: ?userId=1&facilityId=1\
 * For customers, userId is necessar\
 * For managers, facilityId is necessary
 */
orderRouter.get(
  '/:id',
  middleware.verifyToken.bind(middleware),
  middleware.userRightsExtractor.bind(middleware) as RequestHandler,
  middleware.requestParamsCheck.bind(middleware),
  // Checks for user rights must be handled in orderController
  (async (req, res) => {

    await orderController.getById(req, res);

  }) as RequestHandler
);


orderRouter.post(
  '/',
  middleware.setVerifyOptional.bind(middleware),
  middleware.verifyToken.bind(middleware),
  middleware.userRightsExtractor.bind(middleware) as RequestHandler,
  (async (req, res) => {

    await orderController.create(req, res);

  }) as RequestHandler
);

/**
 * Path to update order status with query\
 * Query example: ?facilityId=1&status=1&paymentStatus=1\
 * For managers, facilityId is necessary
 */
orderRouter.put(
  '/:id/status',
  middleware.verifyToken.bind(middleware),
  middleware.userRightsExtractor.bind(middleware) as RequestHandler,
  middleware.managerCheck.bind(middleware),
  middleware.requestParamsCheck.bind(middleware),
  (async (req, res) => {

    await orderController.updateStatus(req, res);

  }) as RequestHandler
);

/**
 * PUT route for orders is supplementary for rare cases, can be used by managers and admins\
 * Rewrites all OrderFoods for this Order, changes all fields for the case if user made a mistake\
 * Query example: ?facilityId=1\
 * For managers, facilityId is necessary
 */
orderRouter.put(
  '/:id',
  middleware.verifyToken.bind(middleware),
  middleware.userRightsExtractor.bind(middleware) as RequestHandler,
  middleware.managerCheck.bind(middleware),
  middleware.requestParamsCheck.bind(middleware),
  (async (req, res) => {

    await orderController.update(req, res);

  }) as RequestHandler
);


export default orderRouter;