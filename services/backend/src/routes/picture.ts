import type { RequestHandler } from 'express';
import { Router } from 'express';
import { middleware } from '../utils/middleware.js';
import { pictureController } from '../controllers/index.js';


const pictureRouter = Router();

pictureRouter.put(
  '/:id',
  middleware.verifyToken.bind(middleware),
  middleware.userRightsExtractor.bind(middleware) as RequestHandler,
  middleware.adminCheck.bind(middleware),
  middleware.requestParamsCheck.bind(middleware),
  (async (req, res) => {

    await pictureController.updateAltTextLoc(req, res);

  }) as RequestHandler
);

export default pictureRouter;